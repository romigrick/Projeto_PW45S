package br.edu.utfpr.pb.pw44s.server.service.impl;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.repository.OrderItemRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
@Service
public class OrderItemServiceImpl extends CrudServiceImpl<OrderItem, Long> implements IOrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    @Override
    protected OrderItemRepository getRepository() {
        return orderItemRepository;
    }
    @Override
    public List<OrderItem> findByOrderId(Long orderId) {
        return orderItemRepository.findByOrderIdOrderByOrderIndex(orderId);
    }
    @Override
    @Transactional
    public OrderItem addItemToOrder(Long orderId, OrderItem item) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        item.setOrder(order);
        if (item.getProduct() != null && item.getProduct().getId() != null) {
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
            item.setPrice(product.getPrice());
            item.setProduct(product);
        }
        List<OrderItem> existingItems = findByOrderId(orderId);
        item.setOrderIndex(existingItems.size());
        OrderItem savedItem = orderItemRepository.save(item);
        recalculateOrderTotal(order);
        return savedItem;
    }
    @Override
    @Transactional
    public OrderItem updateItem(Long orderId, Integer orderIndex, OrderItem item) {
        OrderItem existingItem = orderItemRepository.findByOrderIdAndOrderIndex(orderId, orderIndex);
        if (existingItem == null) {
            throw new RuntimeException("OrderItem not found");
        }
        existingItem.setQuantity(item.getQuantity());
        if (item.getProduct() != null && item.getProduct().getId() != null) {
            Product product = productRepository.findById(item.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
            existingItem.setPrice(product.getPrice());
            existingItem.setProduct(product);
        }
        OrderItem savedItem = orderItemRepository.save(existingItem);
        recalculateOrderTotal(existingItem.getOrder());
        return savedItem;
    }
    @Override
    @Transactional
    public void removeItemFromOrder(Long orderId, Integer orderIndex) {
        OrderItem item = orderItemRepository.findByOrderIdAndOrderIndex(orderId, orderIndex);
        if (item == null) {
            throw new RuntimeException("OrderItem not found");
        }
        orderItemRepository.delete(item);
        recalculateOrderTotal(item.getOrder());
        reorderItems(item.getOrder());
    }
    @Override
    @Transactional
    public void createItemsForOrder(Long orderId, List<OrderItem> items) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        int index = 0;
        for (OrderItem item : items) {
            item.setOrder(order);
            if (item.getProduct() != null && item.getProduct().getId() != null) {
                Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
                item.setPrice(product.getPrice());
                item.setProduct(product);
            }
            item.setOrderIndex(index++);
            orderItemRepository.save(item);
        }
        recalculateOrderTotal(order);
    }
    private void recalculateOrderTotal(Order order) {
        List<OrderItem> items = findByOrderId(order.getId());
        BigDecimal total = items.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotal(total);
        orderRepository.save(order);
    }
    private void reorderItems(Order order) {
        List<OrderItem> items = findByOrderId(order.getId());
        for (int i = 0; i < items.size(); i++) {
            items.get(i).setOrderIndex(i);
            orderItemRepository.save(items.get(i));
        }
    }
}