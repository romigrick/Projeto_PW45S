package br.edu.utfpr.pb.pw44s.server.service.impl;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderStatusHistoryRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.EmailService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@Slf4j
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final IOrderItemService orderItemService;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final EmailService emailService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            IOrderItemService orderItemService,
                            OrderStatusHistoryRepository statusHistoryRepository,
                            EmailService emailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderItemService = orderItemService;
        this.statusHistoryRepository = statusHistoryRepository;
        this.emailService = emailService;
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
        Order savedOrder = orderRepository.save(order);
        orderItemService.createItemsForOrder(savedOrder.getId(), order.getItems());

        log.info("Novo pedido criado | pedido #{} | usuário: {} | total: R$ {}",
                savedOrder.getId(),
                savedOrder.getUser().getUsername(),
                savedOrder.getTotal());

        return orderRepository.findById(savedOrder.getId()).orElse(savedOrder);
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

        // Salva histórico
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setPreviousStatus(previous);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setChangedAt(LocalDateTime.now());
        history.setObservation(observation);
        statusHistoryRepository.save(history);

        // Atualiza status
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        // Envia e-mail
        if (order.getUser() != null && order.getUser().getEmail() != null) {
            emailService.sendOrderStatusUpdate(
                    order.getUser().getEmail(),
                    order.getUser().getDisplayName(),
                    orderId,
                    previous != null ? previous.name() : "N/A",
                    newStatus.name()
            );
        }

        log.info("Status do pedido #{} alterado de {} para {} por {}",
                orderId, previous, newStatus,
                changedBy != null ? changedBy.getUsername() : "sistema");

        return saved;
    }
}