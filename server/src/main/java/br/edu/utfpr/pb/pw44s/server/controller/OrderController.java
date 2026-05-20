package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {
    private final IOrderService orderService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    public OrderController(IOrderService orderService, ModelMapper modelMapper, UserRepository userRepository, AddressRepository addressRepository) {
        super(Order.class, OrderDTO.class);
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }
    @Override
    protected ICrudService<Order, Long> getService() {
        return orderService;
    }
    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> findAll() {
        List<Order> orders = orderService.findAll();
        List<OrderDTO> orderDTOs = orders.stream()
            .map(OrderDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
    @GetMapping("{id}")
    public ResponseEntity<OrderDTO> findOne(@PathVariable Long id) {
        Order order = orderService.findById(id);
        if (order != null) {
            orderService.ensureRelationshipsLoaded(order);
            return ResponseEntity.ok(new OrderDTO(order));
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    @PostMapping("/finalize")
    public ResponseEntity<OrderDTO> finalizePurchase(@RequestBody Order order, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);
        if (order.getAddress() != null && order.getAddress().getId() != null) {
            Address address = addressRepository.findById(order.getAddress().getId()).orElseThrow(() -> new RuntimeException("Address not found"));
            order.setAddress(address);
        }
        Order savedOrder = orderService.createOrder(order);
        OrderDTO orderDTO = new OrderDTO(savedOrder);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedOrder.getId())
                .toUri();
        return ResponseEntity.created(location).body(orderDTO);
    }
    @GetMapping("/user")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<Order> orders = orderService.findByUserId(userId);
        for (Order order : orders) {
            orderService.ensureRelationshipsLoaded(order);
        }
        List<OrderDTO> orderDTOs = orders.stream()
            .map(OrderDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }
    private Long getUserIdFromAuthentication(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findUserByUsername(username);
        if (user != null) {
            return user.getId();
        }
        throw new RuntimeException("User not found: " + username);
    }
}