package br.edu.utfpr.pb.pw44s.server.repository;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderIdOrderByOrderIndex(Long orderId);
    OrderItem findByOrderIdAndOrderIndex(Long orderId, Integer orderIndex);
}