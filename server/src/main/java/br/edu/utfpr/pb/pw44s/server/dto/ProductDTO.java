package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.Category;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String urlImagem;
    private CategoryDTO category;
    public ProductDTO(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.name = product.getName();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.urlImagem = product.getUrlImagem();
            if (product.getCategory() != null) {
                this.category = new CategoryDTO(product.getCategory());
            }
        }
    }
    public  ProductDTO convertToEntity(Product product) {
        return new ProductDTO(product);
    }
}