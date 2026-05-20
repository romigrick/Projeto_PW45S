package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private UserDTO user;
    private AddressDTO address;
    private List<OrderItemDTO> items;
    private BigDecimal total;
    private LocalDateTime orderDate;
    private String status;
    public OrderDTO(Order order) {
        if (order != null) {
            this.id = order.getId();
            this.total = order.getTotal();
            this.orderDate = order.getOrderDate();
            this.status = order.getStatus() != null ? order.getStatus().toString() : null;
            if (order.getUser() != null) {
                this.user = new UserDTO(order.getUser());
            }
            if (order.getAddress() != null) {
                this.address = new AddressDTO(order.getAddress());
            }
            if (order.getItems() != null) {
                this.items = order.getItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
            } else {
                this.items = new ArrayList<>();
            }
        }
    }
}