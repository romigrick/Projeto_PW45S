package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.controller.CrudController;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class CategoryDTO {
    private Long id;
    @NotNull
    private String name;
    public CategoryDTO() {
    }
    public Category convertToEntity() {
        return new Category(this.id, this.name);
    }
    public CategoryDTO(Category category) {
        if (category != null) {
            this.id = category.getId();
            this.name = category.getName();
        }
    }
}