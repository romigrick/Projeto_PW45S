package br.edu.utfpr.pb.pw44s.server.service.impl;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final IOrderItemService orderItemService;
    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository, IOrderItemService orderItemService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderItemService = orderItemService;
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
        order.setStatus(Order.OrderStatus.PENDING);
        for (int i = 0; i < order.getItems().size(); i++) {
            order.getItems().get(i).setOrderIndex(i);
        }
        Order savedOrder = orderRepository.save(order);
        orderItemService.createItemsForOrder(savedOrder.getId(), order.getItems());
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
}