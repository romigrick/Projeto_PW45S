package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.OrderAttachmentDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderStatusHistoryDTO;
import br.edu.utfpr.pb.pw44s.server.minio.config.MinioConfig;
import br.edu.utfpr.pb.pw44s.server.minio.payload.FileResponse;
import br.edu.utfpr.pb.pw44s.server.minio.service.MinioService;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderAttachmentRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderStatusHistoryRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.EmailService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import cn.hutool.core.io.resource.InputStreamResource;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {
    private final IOrderService orderService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final EmailService emailService;
    private final OrderAttachmentRepository attachmentRepository;
    private final MinioService minioService;
    private final MinioConfig minioConfig;

    public OrderController(IOrderService orderService, ModelMapper modelMapper,
                           UserRepository userRepository, AddressRepository addressRepository,
                           OrderStatusHistoryRepository statusHistoryRepository,
                           EmailService emailService,
                           OrderAttachmentRepository attachmentRepository,
                           MinioService minioService,
                           MinioConfig minioConfig){
        super(Order.class, OrderDTO.class);
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.emailService = emailService;
        this.attachmentRepository = attachmentRepository;
        this.minioService = minioService;
        this.minioConfig = minioConfig;
    }
    @Override
    protected ICrudService<Order, Long> getService() {
        return orderService;
    }
    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> findAll() {
        List<Order> orders = orderService.findAll();
        List<OrderDTO> orderDTOs = orders.stream()
            .map(OrderDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
    @GetMapping("{id}")
    public ResponseEntity<OrderDTO> findOne(@PathVariable Long id) {
        Order order = orderService.findById(id);
        if (order != null) {
            orderService.ensureRelationshipsLoaded(order);
            return ResponseEntity.ok(new OrderDTO(order));
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    @PostMapping("/finalize")
    public ResponseEntity<OrderDTO> finalizePurchase(@RequestBody Order order, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);
        if (order.getAddress() != null && order.getAddress().getId() != null) {
            Address address = addressRepository.findById(order.getAddress().getId()).orElseThrow(() -> new RuntimeException("Address not found"));
            order.setAddress(address);
        }
        Order savedOrder = orderService.createOrder(order);
        OrderDTO orderDTO = new OrderDTO(savedOrder);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedOrder.getId())
                .toUri();
        return ResponseEntity.created(location).body(orderDTO);
    }
    @GetMapping("/user")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<Order> orders = orderService.findByUserId(userId);
        for (Order order : orders) {
            orderService.ensureRelationshipsLoaded(order);
        }
        List<OrderDTO> orderDTOs = orders.stream()
            .map(OrderDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
    private Long getUserIdFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            return user.getId();
        }
        throw new RuntimeException("User not found: " + username);
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") Order.OrderStatus status,
            @RequestParam(required = false) String observation,
            @RequestParam(value = "file", required = false) MultipartFile[] files,
            Authentication authentication) {

        User changedBy = userRepository.findUserByUsername(authentication.getName());

        Order orderBefore = orderService.findById(id);
        if (orderBefore == null) return ResponseEntity.notFound().build();
        String previousStatusStr = orderBefore.getStatus() != null ? orderBefore.getStatus().name() : "N/A";

        Order updated = orderService.updateOrderStatus(id, status, observation, changedBy);

        // Map para acumular todos os arquivos e enviar um único email
        Map<String, byte[]> invoiceMap = new LinkedHashMap<>();

        // 2. Aarray de arquivos
        if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String fileType = file.getContentType();
                FileResponse fileResponse = minioService.putObject(file, minioConfig.getBucketName(), fileType);

                if (fileResponse == null || fileResponse.getFilename() == null) {
                    log.error("Falha ao fazer upload do arquivo {} para o MinIO", file.getOriginalFilename());
                    continue;
                }

                // Cria o vínculo de anexo para cada um dos arquivos no banco de dados
                OrderAttachment attachment = new OrderAttachment();
                attachment.setOrder(updated);
                attachment.setOriginalFileName(file.getOriginalFilename());
                attachment.setStoredFileName(fileResponse.getFilename());
                attachment.setContentType(fileType);
                attachment.setFileSize(file.getSize());
                attachment.setUploadedAt(LocalDateTime.now());
                attachment.setDescription(observation != null ? observation : "Nota Fiscal / Comprovante de alteração de status");
                attachment.setUploadedBy(changedBy);

                attachmentRepository.save(attachment);

                try {
                    // Armazena os bytes de cada arquivo no map do email
                    invoiceMap.put(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    log.error("Erro ao ler os bytes do arquivo {} para o e-mail: {}", file.getOriginalFilename(), e.getMessage());
                }
            }
        }

        // 3. Envio do email agrupado
        if (updated.getUser() != null && updated.getUser().getEmail() != null) {
            if (!invoiceMap.isEmpty()) {
                // Envia o email com todos os arquivos anexados de uma vez só
                emailService.sendOrderStatusUpdateWithAttachments(
                        updated.getUser().getEmail(),
                        updated.getUser().getDisplayName(),
                        updated.getId(),
                        previousStatusStr,
                        status.name(),
                        invoiceMap,
                        observation
                );
            } else {
                // Se nenhum arquivo válido foi enviado, manda o email simples apenas com a observação
                emailService.sendOrderStatusUpdate(
                        updated.getUser().getEmail(),
                        updated.getUser().getDisplayName(),
                        updated.getId(),
                        previousStatusStr,
                        status.name(),
                        observation
                );
            }
        }

        return ResponseEntity.ok(new OrderDTO(updated));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderStatusHistoryDTO>> getHistory(@PathVariable Long id) {
        List<OrderStatusHistory> history = statusHistoryRepository
                .findByOrderIdOrderByChangedAtDesc(id);
        return ResponseEntity.ok(history.stream()
                .map(OrderStatusHistoryDTO::new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        emailService.sendOrderStatusUpdate(
                "giseli3690@gmail.com",
                "Giseli",
                1L,
                "AGUARDANDO_PAGAMENTO",
                "PAGO",
                "Seu pagamento foi confirmado pelo gateway!"
        );
        return ResponseEntity.ok("E-mail enviado!");
    }

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderAttachmentDTO>> uploadMultipleAttachments(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(required = false) String description,
            Authentication authentication) {

        Order order = orderService.findById(id);
        if (order == null) return ResponseEntity.notFound().build();

        User userLogged = userRepository.findUserByUsername(authentication.getName());
        List<OrderAttachmentDTO> savedAttachmentsDTOs = new ArrayList<>();

        // 1. Criar o map para acumular os arquivos que serão enviados no único email
        java.util.Map<String, byte[]> attachmentsMap = new java.util.LinkedHashMap<>();

        // 2. Iterar sobre todos os arquivos enviados
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String fileType = file.getContentType();
            FileResponse fileResponse = minioService.putObject(file, minioConfig.getBucketName(), fileType);

            if (fileResponse == null || fileResponse.getFilename() == null) {
                log.error("Falha ao fazer upload do arquivo {} para o MinIO", file.getOriginalFilename());
                continue;
            }

            OrderAttachment attachment = new OrderAttachment();
            attachment.setOrder(order);
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setStoredFileName(fileResponse.getFilename());
            attachment.setContentType(fileType);
            attachment.setFileSize(file.getSize());
            attachment.setUploadedAt(LocalDateTime.now());
            attachment.setDescription(description);
            attachment.setUploadedBy(userLogged);

            OrderAttachment saved = attachmentRepository.save(attachment);
            savedAttachmentsDTOs.add(new OrderAttachmentDTO(saved));

            // 3. extrai os bytes e guarda no mapa
            try {
                attachmentsMap.put(file.getOriginalFilename(), file.getBytes());
            } catch (IOException e) {
                log.error("Erro ao ler bytes do arquivo {} para o lote de e-mail: {}", file.getOriginalFilename(), e.getMessage());
            }
        }

        // 4. Se houver arquivos válidos e o usuário tiver email, envia um único email agrupado
        if (!attachmentsMap.isEmpty() && order.getUser() != null && order.getUser().getEmail() != null) {
            emailService.sendOrderMultipleAttachmentsNotification(
                    order.getUser().getEmail(),
                    order.getUser().getDisplayName(),
                    order.getId(),
                    order.getStatus() != null ? order.getStatus().name() : "N/A",
                    attachmentsMap,
                    description
            );
        }

        // Retorna a lista com todos os anexos criados com sucesso
        return ResponseEntity.ok(savedAttachmentsDTOs);
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<OrderAttachmentDTO>> listAttachments(
            @PathVariable Long id,
            Authentication authentication) {

        Order order = orderService.findById(id);
        if (order == null) return ResponseEntity.notFound().build();

        // cliente só vê anexos do próprio pedido
        if (!isAdminOrOperator(authentication)) {
            User user = userRepository.findUserByUsername(authentication.getName());
            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        List<OrderAttachment> attachments = attachmentRepository
                .findByOrderIdOrderByUploadedAtDesc(id);
        return ResponseEntity.ok(attachments.stream()
                .map(OrderAttachmentDTO::new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}/attachments/{attachmentId}/download")
    public ResponseEntity<InputStreamResource> downloadAttachment(
            @PathVariable Long id,
            @PathVariable Long attachmentId,
            Authentication authentication) {

        Order order = orderService.findById(id);
        if (order == null) return ResponseEntity.notFound().build();

        // cliente só baixa anexo se o pedido for dele
        if (!isAdminOrOperator(authentication)) {
            User user = userRepository.findUserByUsername(authentication.getName());
            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        OrderAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Anexo não encontrado"));

        // garante que o anexo pertence ao pedido da URL
        if (!attachment.getOrder().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        InputStream stream = minioService.downloadObject(
                minioConfig.getBucketName(), attachment.getStoredFileName());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .body(new InputStreamResource(stream));
    }

    //
    private boolean isAdminOrOperator(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_OPERATOR"));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderDTO>> findByStatus(@PathVariable Order.OrderStatus status) {
        List<Order> orders = orderService.findByStatus(status);
        List<OrderDTO> orderDTOs = orders.stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
}