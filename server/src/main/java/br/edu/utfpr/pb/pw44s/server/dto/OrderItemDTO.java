package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private ProductDTO product;
    private Integer quantity;
    private BigDecimal price;
    public OrderItemDTO(OrderItem orderItem) {
        if (orderItem != null) {
            this.id = orderItem.getId();
            this.quantity = orderItem.getQuantity();
            this.price = orderItem.getPrice();
            if (orderItem.getProduct() != null) {
                this.product = new ProductDTO(orderItem.getProduct());
            }
        }
    }
}