package br.edu.utfpr.pb.pw44s.server.service;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;
public interface IOrderService extends ICrudService<Order, Long> {
    List<Order> findByUserId(Long userId);
    Order createOrder(Order order);
    void ensureRelationshipsLoaded(Order order);
    List<Order> findByStatus(Order.OrderStatus status);
    Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus,
                            String observation, User changedBy);
}