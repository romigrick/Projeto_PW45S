package br.edu.utfpr.pb.pw44s.server;
import br.edu.utfpr.pb.pw44s.server.model.Product;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductControllerTest {
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
    public void postProduct_whenProductIsValid_receiveCreated() throws Exception {
        Product product = new Product();
        product.setName("Produto Teste");
        product.setDescription("Descrição Teste");
        product.setPrice(BigDecimal.valueOf(10.99));
        String productJson = objectMapper.writeValueAsString(product);
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isCreated());
    }
    @Test
    @WithMockUser(username = "testuser")
    public void postProduct_whenProductIsValid_productSavedToDatabase() throws Exception {
        Product product = new Product();
        product.setName("Produto Teste");
        product.setDescription("Descrição Teste");
        product.setPrice(BigDecimal.valueOf(10.99));
        String productJson = objectMapper.writeValueAsString(product);
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isCreated());
        assertThat(productRepository.count()).isEqualTo(1);
    }
    @Test
    @WithMockUser(username = "testuser")
    public void postProduct_whenProductHasNullName_receiveBadRequest() throws Exception {
        Product product = new Product();
        product.setName(null);
        product.setDescription("Descrição Teste");
        product.setPrice(BigDecimal.valueOf(10.99));
        String productJson = objectMapper.writeValueAsString(product);
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
                .andExpect(status().isBadRequest());
    }
}