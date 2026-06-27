package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GoogleAuthRequest {
    private String email;
    private String displayName;
    private String generatedPassword;
}
