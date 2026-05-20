package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;
@RestController
@RequestMapping("addresses")
public class AddressController extends CrudController<Address, AddressDTO, Long> {
    private final IAddressService addressService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    public AddressController(IAddressService addressService, ModelMapper modelMapper, UserRepository userRepository) {
        super(Address.class, AddressDTO.class);
        this.addressService = addressService;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }
    @Override
    protected ICrudService<Address, Long> getService() {
        return addressService;
    }
    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }
    public ResponseEntity<List<AddressDTO>> findAll() {
        List<Address> addresses = addressService.findAll();
        List<AddressDTO> dtos = addresses.stream()
            .map(AddressDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    @Override
    @PostMapping
    public ResponseEntity<AddressDTO> create(@Valid @RequestBody AddressDTO entityDto) {
        Address entity = getModelMapper().map(entityDto, Address.class);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Long userId = getUserIdFromAuthentication(authentication);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            entity.setUser(user);
        }
        Address saved = addressService.save(entity);
        AddressDTO dto = new AddressDTO(saved);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(saved.getId())
            .toUri();
        return ResponseEntity.created(location).body(dto);
    }
    @GetMapping("/user")
    public ResponseEntity<List<AddressDTO>> getAddressesByUser(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<Address> addresses = addressService.findByUserId(userId);
        List<AddressDTO> dtos = addresses.stream()
            .map(AddressDTO::new)
            .toList();
        return ResponseEntity.ok(dtos);
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