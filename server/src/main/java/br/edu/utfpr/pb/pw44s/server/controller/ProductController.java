package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("products")
public class ProductController {
    private final IProductService productService;
    private final ModelMapper modelMapper;
    public ProductController(IProductService productService, ModelMapper modelMapper)
    {
        this.productService = productService;
        this.modelMapper = modelMapper;
    }
    @PostMapping
    public ResponseEntity<Product> save(@Valid @RequestBody Product product){
        productService.save(product);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(product.getId()).toUri();
        return ResponseEntity.created(location).build();
    }
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll(){
        List<ProductDTO> dtos = productService.findAll().stream()
            .map(ProductDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping ("page")
    public ResponseEntity<List<ProductDTO>> findAll(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) Boolean asc){
        PageRequest pageRequest = PageRequest.of(page, size);
        if(order != null && asc != null){
            pageRequest = PageRequest.of(page,
                    size,
                    Sort.by(asc ? Sort.Direction.ASC : Sort.Direction.DESC, order));
        }
        List<ProductDTO> dtos = this.productService.findAll(pageRequest).getContent().stream()
            .map(ProductDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id){
        Product product = this.productService.findById(id);
        if(product == null){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(new ProductDTO(product));
    }
    @DeleteMapping("{id}")
    @ResponseStatus
    public void deleteById(@PathVariable Long id){
        this.productService.deleteById(id);
    }
    @GetMapping("category/{id}")
    public ResponseEntity<List<ProductDTO>> findAllByCategoryId(@PathVariable long id){
        List<ProductDTO> dtos = this.productService.findAllByCategoryId(id).stream()
            .map(ProductDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("category/name/{name}")
    public ResponseEntity<List<ProductDTO>> findAllByCategoryName(@PathVariable String name){
        List<ProductDTO> dtos = this.productService.findAllByCategoryName(name).stream()
            .map(ProductDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}