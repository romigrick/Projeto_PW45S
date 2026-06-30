package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.minio.config.MinioConfig;
import br.edu.utfpr.pb.pw44s.server.minio.payload.FileResponse;
import br.edu.utfpr.pb.pw44s.server.minio.service.MinioService;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.*;
import br.edu.utfpr.pb.pw44s.server.service.EmailService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final IOrderItemService orderItemService;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderAttachmentRepository attachmentRepository;
    private final MinioService minioService;
    private final MinioConfig minioConfig;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            IOrderItemService orderItemService,
                            OrderStatusHistoryRepository statusHistoryRepository,
                            EmailService emailService,
                            UserRepository userRepository,
                            AddressRepository addressRepository,
                            OrderAttachmentRepository attachmentRepository,
                            MinioService minioService,
                            MinioConfig minioConfig) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderItemService = orderItemService;
        this.statusHistoryRepository = statusHistoryRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.attachmentRepository = attachmentRepository;
        this.minioService = minioService;
        this.minioConfig = minioConfig;
    }

    @Override
    protected OrderRepository getRepository() {
        return orderRepository;
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findAll() {
        List<Order> orders = orderRepository.findAllWithAllRelationships();
        for (Order order : orders) {
            ensureRelationshipsLoaded(order);
        }
        return orders;
    }

    @Override
    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.AGUARDANDO_PAGAMENTO);
        for (int i = 0; i < order.getItems().size(); i++) {
            order.getItems().get(i).setOrderIndex(i);
        }

        BigDecimal subtotal = order.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal freeThreshold = new BigDecimal("1000");

        if (order.getShippingType() == Order.ShippingType.EXPRESSO) {
            order.setShippingCost(
                    subtotal.compareTo(freeThreshold) >= 0
                            ? new BigDecimal("45.00")
                            : new BigDecimal("59.90")
            );
        } else {
            order.setShippingCost(
                    subtotal.compareTo(freeThreshold) >= 0
                            ? BigDecimal.ZERO
                            : new BigDecimal("29.90")
            );
        }

        order.setTotal(subtotal);

        Order savedOrder = orderRepository.save(order);
        orderItemService.createItemsForOrder(savedOrder.getId(), order.getItems());

        log.info("Novo pedido criado | pedido #{} | usuário: {} - {} | total: R$ {}",
                savedOrder.getId(),
                savedOrder.getUser().getId(),
                savedOrder.getUser().getUsername(),
                savedOrder.getTotal());

        return orderRepository.findById(savedOrder.getId()).orElse(savedOrder);
    }

    @Override
    @Transactional
    public Order finalizePurchase(Order order, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        if (order.getAddress() != null && order.getAddress().getId() != null) {
            Address address = addressRepository.findById(order.getAddress().getId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            order.setAddress(address);
        }

        return createOrder(order);
    }

    public void ensureRelationshipsLoaded(Order order) {
        if (order.getItems() != null) {
            order.getItems().sort((a, b) -> {
                if (a.getOrderIndex() == null && b.getOrderIndex() == null) return 0;
                if (a.getOrderIndex() == null) return 1;
                if (b.getOrderIndex() == null) return -1;
                return a.getOrderIndex().compareTo(b.getOrderIndex());
            });
        }
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus,
                                   String observation, User changedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + orderId));

        Order.OrderStatus previous = order.getStatus();

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setPreviousStatus(previous);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setChangedAt(LocalDateTime.now());
        history.setObservation(observation);
        statusHistoryRepository.save(history);

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        log.info("Status do pedido #{} alterado de {} para {} por {}",
                orderId, previous, newStatus,
                changedBy != null ? changedBy.getUsername() : "sistema");

        return saved;
    }

    @Override
    @Transactional
    public Order updateOrderStatusWithAttachments(Long orderId, Order.OrderStatus status, String observation,
                                                  MultipartFile[] files, User changedBy) {
        Order orderBefore = findById(orderId);
        if (orderBefore == null) {
            throw new RuntimeException("Pedido não encontrado: " + orderId);
        }
        String previousStatusStr = orderBefore.getStatus() != null ? orderBefore.getStatus().name() : "N/A";

        Order updated = updateOrderStatus(orderId, status, observation, changedBy);

        Map<String, byte[]> invoiceMap = new LinkedHashMap<>();

        if (files != null) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String fileType = file.getContentType();
                FileResponse fileResponse = minioService.putObject(file, minioConfig.getBucketName(), fileType);

                if (fileResponse == null || fileResponse.getFilename() == null) {
                    log.error("Falha ao fazer upload do arquivo {} para o MinIO", file.getOriginalFilename());
                    continue;
                }

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
                    invoiceMap.put(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    log.error("Erro ao ler os bytes do arquivo {} para o e-mail: {}", file.getOriginalFilename(), e.getMessage());
                }
            }
        }

        if (updated.getUser() != null && updated.getUser().getEmail() != null) {
            if (!invoiceMap.isEmpty()) {
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

        return updated;
    }

    @Override
    @Transactional
    public List<OrderAttachment> addAttachmentsToOrder(Long orderId, MultipartFile[] files,
                                                       String description, User uploadedBy) {
        Order order = findById(orderId);
        if (order == null) {
            throw new RuntimeException("Pedido não encontrado: " + orderId);
        }

        List<OrderAttachment> savedAttachments = new ArrayList<>();
        Map<String, byte[]> attachmentsMap = new LinkedHashMap<>();

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
            attachment.setUploadedBy(uploadedBy);

            savedAttachments.add(attachmentRepository.save(attachment));

            try {
                attachmentsMap.put(file.getOriginalFilename(), file.getBytes());
            } catch (IOException e) {
                log.error("Erro ao ler bytes do arquivo {} para o lote de e-mail: {}", file.getOriginalFilename(), e.getMessage());
            }
        }

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

        return savedAttachments;
    }

    @Override
    public List<OrderAttachment> getAttachmentsForOrder(Long orderId) {
        return attachmentRepository.findByOrderIdOrderByUploadedAtDesc(orderId);
    }

    @Override
    public boolean isOrderOwner(Order order, User user) {
        return order.getUser() != null && user != null
                && order.getUser().getId().equals(user.getId());
    }

    @Override
    public OrderAttachment getValidatedAttachment(Long orderId, Long attachmentId) {
        OrderAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Anexo não encontrado"));
        if (!attachment.getOrder().getId().equals(orderId)) {
            throw new SecurityException("Anexo não pertence ao pedido informado");
        }
        return attachment;
    }

    @Override
    public InputStream downloadAttachmentFile(OrderAttachment attachment) {
        return minioService.downloadObject(minioConfig.getBucketName(), attachment.getStoredFileName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        for (Order order : orders) {
            ensureRelationshipsLoaded(order);
        }
        return orders;
    }
}