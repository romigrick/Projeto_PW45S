package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderStatusHistoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderStatusHistoryRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.EmailService;
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
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final EmailService emailService;

    public OrderController(IOrderService orderService, ModelMapper modelMapper,
                           UserRepository userRepository, AddressRepository addressRepository,
                           OrderStatusHistoryRepository statusHistoryRepository,
                           EmailService emailService) {
        super(Order.class, OrderDTO.class);
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.emailService = emailService;
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

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status,
            @RequestParam(required = false) String observation,
            Authentication authentication) {

        User changedBy = userRepository.findUserByUsername(authentication.getName());
        Order updated = orderService.updateOrderStatus(id, status, observation, changedBy);
        return ResponseEntity.ok(new OrderDTO(updated));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<List<OrderStatusHistoryDTO>> getHistory(@PathVariable Long id) {
        List<OrderStatusHistory> history = statusHistoryRepository
                .findByOrderIdOrderByChangedAtDesc(id);
        return ResponseEntity.ok(history.stream()
                .map(OrderStatusHistoryDTO::new)
                .collect(Collectors.toList()));
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        emailService.sendOrderStatusUpdate(
                "giseli3690@gmail.com",
                "Giseli",
                1L,
                "AGUARDANDO_PAGAMENTO",
                "PAGO"
        );
        return ResponseEntity.ok("E-mail enviado!");
    }
}