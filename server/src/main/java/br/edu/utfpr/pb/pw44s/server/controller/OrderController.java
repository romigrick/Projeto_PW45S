package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderAttachmentDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderStatusHistoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.OrderStatusHistoryRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.core.io.InputStreamResource;
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

import java.io.InputStream;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {
    private final IOrderService orderService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;

    public OrderController(IOrderService orderService, ModelMapper modelMapper,
                           UserRepository userRepository,
                           OrderStatusHistoryRepository statusHistoryRepository) {
        super(Order.class, OrderDTO.class);
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.statusHistoryRepository = statusHistoryRepository;
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderDTO>> findAll() {
        List<OrderDTO> orderDTOs = orderService.findAll().stream()
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
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/finalize")
    public ResponseEntity<OrderDTO> finalizePurchase(@RequestBody Order order, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        Order savedOrder = orderService.finalizePurchase(order, userId);
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
        Order updated = orderService.updateOrderStatusWithAttachments(id, status, observation, files, changedBy);
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

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderAttachmentDTO>> uploadMultipleAttachments(
            @PathVariable Long id,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(required = false) String description,
            Authentication authentication) {

        User userLogged = userRepository.findUserByUsername(authentication.getName());
        List<OrderAttachment> saved = orderService.addAttachmentsToOrder(id, files, description, userLogged);

        List<OrderAttachmentDTO> dtos = saved.stream()
                .map(OrderAttachmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<OrderAttachmentDTO>> listAttachments(
            @PathVariable Long id,
            Authentication authentication) {

        Order order = orderService.findById(id);
        if (order == null) return ResponseEntity.notFound().build();

        if (!isAdminOrOperator(authentication)) {
            User user = userRepository.findUserByUsername(authentication.getName());
            if (!orderService.isOrderOwner(order, user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        List<OrderAttachmentDTO> dtos = orderService.getAttachmentsForOrder(id).stream()
                .map(OrderAttachmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}/attachments/{attachmentId}/download")
    public ResponseEntity<InputStreamResource> downloadAttachment(
            @PathVariable Long id,
            @PathVariable Long attachmentId,
            Authentication authentication) {

        Order order = orderService.findById(id);
        if (order == null) return ResponseEntity.notFound().build();

        if (!isAdminOrOperator(authentication)) {
            User user = userRepository.findUserByUsername(authentication.getName());
            if (!orderService.isOrderOwner(order, user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        OrderAttachment attachment;
        try {
            attachment = orderService.getValidatedAttachment(id, attachmentId);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        InputStream stream = orderService.downloadAttachmentFile(attachment);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .body(new InputStreamResource(stream));
    }

    private boolean isAdminOrOperator(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_OPERATOR"));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderDTO>> findByStatus(@PathVariable Order.OrderStatus status) {
        List<OrderDTO> orderDTOs = orderService.findByStatus(status).stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
}