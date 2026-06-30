package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderAttachment;
import br.edu.utfpr.pb.pw44s.server.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {
    List<Order> findByUserId(Long userId);
    Order createOrder(Order order);
    void ensureRelationshipsLoaded(Order order);
    List<Order> findByStatus(Order.OrderStatus status);
    Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus,
                            String observation, User changedBy);

    Order finalizePurchase(Order order, Long userId);

    Order updateOrderStatusWithAttachments(Long orderId, Order.OrderStatus status, String observation, MultipartFile[] files, User changedBy);

    List<OrderAttachment> addAttachmentsToOrder(Long orderId, MultipartFile[] files, String description, User uploadedBy);

    List<OrderAttachment> getAttachmentsForOrder(Long orderId);

    boolean isOrderOwner(Order order, User user);

    OrderAttachment getValidatedAttachment(Long orderId, Long attachmentId);

    InputStream downloadAttachmentFile(OrderAttachment attachment);
}