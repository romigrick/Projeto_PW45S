package br.edu.utfpr.pb.pw44s.server.service;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import java.util.List;
public interface IOrderItemService extends ICrudService<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    OrderItem addItemToOrder(Long orderId, OrderItem item);
    OrderItem updateItem(Long orderId, Integer orderIndex, OrderItem item);
    void removeItemFromOrder(Long orderId, Integer orderIndex);
    void createItemsForOrder(Long orderId, List<OrderItem> items);
}