package br.edu.utfpr.pb.pw44s.server;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.math.BigDecimal;
import java.util.ArrayList;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OrderControllerTest {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @BeforeEach
    public void setup() {
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        addressRepository.deleteAll();
        userRepository.deleteAll();
    }
    @Test
    @WithMockUser(username = "testuser")
    public void testGetOrdersByUser() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setDisplayName("Test User");
        user.setPassword("Password1");
        String userJson = objectMapper.writeValueAsString(user);
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isOk());
        mockMvc.perform(get("/orders/user"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("[]"));
    }
    @Test
    @WithMockUser(username = "testuser")
    public void testFinalizePurchase() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setDisplayName("Test User");
        user.setPassword("Password1");
        String userJson = objectMapper.writeValueAsString(user);
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isOk());
        Address address = new Address();
        address.setStreet("Rua Teste");
        address.setNumber("123");
        address.setCity("Cidade Teste");
        address.setState("Estado Teste");
        address.setZipCode("12345-678");
        address.setCountry("Brasil");
        address.setUser(userRepository.findUserByUsername("testuser"));
        Address savedAddress = addressRepository.save(address);
        Category category = new Category();
        category.setName("Test Category");
        Category savedCategory = categoryRepository.save(category);
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(new BigDecimal("10.00"));
        product.setCategory(savedCategory);
        Product savedProduct = productRepository.save(product);
        Order order = new Order();
        order.setAddress(savedAddress);
        OrderItem item = new OrderItem();
        item.setProduct(savedProduct);
        item.setQuantity(2);
        item.setPrice(savedProduct.getPrice());
        order.setItems(new ArrayList<>());
        order.getItems().add(item);
        String orderJson = objectMapper.writeValueAsString(order);
        mockMvc.perform(post("/orders/finalize")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isCreated());
    }
}