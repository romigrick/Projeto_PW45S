package br.edu.utfpr.pb.pw44s.server.controller;
import br.edu.utfpr.pb.pw44s.server.dto.CategoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.service.ICategoryService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("categories")
public class CategoryController extends CrudController<Category, CategoryDTO, Long> {
    private final ICategoryService categoryService;
    private final ModelMapper modelMapper;
    public CategoryController(ICategoryService categoryService, ModelMapper modelMapper) {
        super(Category.class, CategoryDTO.class);
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
    }
    @Override
    protected ICrudService<Category, Long> getService() {
        return this.categoryService;
    }
    @Override
    protected ModelMapper getModelMapper() {
        return this.modelMapper;
    }
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAll() {
        List<CategoryDTO> dtos = categoryService.findAll().stream()
            .map(category -> modelMapper.map(category, CategoryDTO.class))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("search")
    public ResponseEntity<List<CategoryDTO>> findByName(@RequestParam String name) {
        List<CategoryDTO> dtos = categoryService.findByNameContainingIgnoreCase(name).stream()
            .map(category -> modelMapper.map(category, CategoryDTO.class))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
