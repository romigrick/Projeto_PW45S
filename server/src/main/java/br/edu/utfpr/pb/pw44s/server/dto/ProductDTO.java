package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String urlImagem;
    private CategoryDTO category;
    private  String imageName;
    private  String contentType;

    public ProductDTO() {}

    // Construtor @Builder
    @Builder
    public ProductDTO(Long id, String name, String description, BigDecimal price,
                      String urlImagem, CategoryDTO category,
                      String imageName, String contentType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.urlImagem = urlImagem;
        this.category = category;
        this.imageName = imageName;
        this.contentType = contentType;
    }

    // Construtor de conversão
    public ProductDTO(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.name = product.getName();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.urlImagem = product.getUrlImagem();
            this.imageName = product.getImageName();
            this.contentType = product.getContentType();
            if (product.getCategory() != null) {
                this.category = new CategoryDTO(product.getCategory());
            }
        }
    }
}