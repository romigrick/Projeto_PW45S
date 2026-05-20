package br.edu.utfpr.pb.pw44s.server;
import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AddressControllerTest {
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
    public void postAddress_whenAddressIsValid_receiveCreated() throws Exception {
        br.edu.utfpr.pb.pw44s.server.model.User testUser = new br.edu.utfpr.pb.pw44s.server.model.User();
        testUser.setUsername("testuser");
        testUser.setDisplayName("Test User");
        testUser.setPassword("Password1");
        userRepository.save(testUser);
        AddressDTO address = AddressDTO.builder()
                .street("Rua Teste")
                .number("123")
                .city("Cidade Teste")
                .state("Estado Teste")
                .zipCode("12345-678")
                .country("Brasil")
                .build();
        String addressJson = objectMapper.writeValueAsString(address);
        mockMvc.perform(post("/addresses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(addressJson))
                .andExpect(status().isCreated());
    }
    @Test
    @WithMockUser(username = "testuser")
    public void postAddress_whenAddressHasNullStreet_receiveBadRequest() throws Exception {
        AddressDTO address = AddressDTO.builder()
                .street(null)
                .number("123")
                .city("Cidade Teste")
                .state("Estado Teste")
                .zipCode("12345-678")
                .country("Brasil")
                .build();
        String addressJson = objectMapper.writeValueAsString(address);
        mockMvc.perform(post("/addresses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(addressJson))
                .andExpect(status().isBadRequest());
    }
}