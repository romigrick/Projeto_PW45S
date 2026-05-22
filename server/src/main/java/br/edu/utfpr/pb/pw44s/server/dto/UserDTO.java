package br.edu.utfpr.pb.pw44s.server.dto;
import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String displayName;

    private boolean active;
    private Set<String> roles;

    public UserDTO(User user) {
        if (user != null) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.displayName = user.getDisplayName();
            this.active = user.isActive();

            if (user.getUserAuthorities() != null) {
                this.roles = user.getUserAuthorities().stream()
                        .map(authority -> authority.getAuthority())
                        .collect(Collectors.toSet());
            }
        }
    }
}