package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Long id;
    @NotBlank
    private String street;
    private String number;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    public AddressDTO(Address address) {
        if (address != null) {
            this.id = address.getId();
            this.street = address.getStreet();
            this.number = address.getNumber();
            this.city = address.getCity();
            this.state = address.getState();
            this.zipCode = address.getZipCode();
            this.country = address.getCountry();
        }
    }
}