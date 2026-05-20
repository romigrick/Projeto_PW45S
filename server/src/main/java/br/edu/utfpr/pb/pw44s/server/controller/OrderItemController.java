package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.service.IOrderItemService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("orders/{orderId}/items")
public class OrderItemController {
    private final IOrderItemService orderItemService;
    private final ModelMapper modelMapper;
    public OrderItemController(IOrderItemService orderItemService, ModelMapper modelMapper) {
        this.orderItemService = orderItemService;
        this.modelMapper = modelMapper;
    }
    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> findAllByOrder(@PathVariable Long orderId) {
        List<OrderItem> items = orderItemService.findByOrderId(orderId);
        List<OrderItemDTO> dtos = items.stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @PostMapping
    public ResponseEntity<OrderItemDTO> addItem(@PathVariable Long orderId, @RequestBody OrderItemDTO itemDto) {
        OrderItem item = modelMapper.map(itemDto, OrderItem.class);
        OrderItem saved = orderItemService.addItemToOrder(orderId, item);
        OrderItemDTO dto = new OrderItemDTO(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    @PutMapping("{orderIndex}")
    public ResponseEntity<OrderItemDTO> updateItem(@PathVariable Long orderId, @PathVariable Integer orderIndex, @RequestBody OrderItemDTO itemDto) {
        OrderItem item = modelMapper.map(itemDto, OrderItem.class);
        OrderItem updated = orderItemService.updateItem(orderId, orderIndex, item);
        OrderItemDTO dto = new OrderItemDTO(updated);
        return ResponseEntity.ok(dto);
    }
    @DeleteMapping("{orderIndex}")
    public ResponseEntity<Void> removeItem(@PathVariable Long orderId, @PathVariable Integer orderIndex) {
        orderItemService.removeItemFromOrder(orderId, orderIndex);
        return ResponseEntity.noContent().build();
    }
}