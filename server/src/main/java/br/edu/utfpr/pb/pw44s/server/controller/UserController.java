package br.edu.utfpr.pb.pw44s.server.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import br.edu.utfpr.pb.pw44s.server.dto.GoogleAuthRequest;
import br.edu.utfpr.pb.pw44s.server.security.SecurityConstants;
import br.edu.utfpr.pb.pw44s.server.security.dto.AuthenticationResponse;
import br.edu.utfpr.pb.pw44s.server.security.dto.UserResponseDTO;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;
import org.springframework.http.ResponseEntity;
import br.edu.utfpr.pb.pw44s.server.dto.GoogleAuthRequest;
import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.error.ApiError;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.security.SecurityConstants;
import br.edu.utfpr.pb.pw44s.server.security.dto.AuthenticationResponse;
import br.edu.utfpr.pb.pw44s.server.security.dto.UserResponseDTO;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public GenericResponse createUser(@Valid @RequestBody User user) {
        this.userService.save(user);
        return new GenericResponse("Usuário cadastrado com sucesso.");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public Page<UserDTO> listUsers(Pageable pageable) {
        return userService.findAll(pageable).map(UserDTO::new);
    }

    @PostMapping("/google-auth")
    public ResponseEntity<AuthenticationResponse> googleAuth(@RequestBody GoogleAuthRequest request) {
        User user = userService.findOrCreateGoogleUser(request);

        String token = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET));

        return ResponseEntity.ok(new AuthenticationResponse(token, new UserResponseDTO(user)));
    }

    @PatchMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMIN')")
    public GenericResponse activateAndAssignRole(@PathVariable Long id, @RequestParam String roleName) {
        userService.activateUserAndSetRole(id, roleName);
        return new GenericResponse("Usuário ativado e permissão concedida.");
    }

    @PatchMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMIN')")
    public GenericResponse deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return new GenericResponse("Usuário desativado com sucesso.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleException(MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        BindingResult bindingResult = exception.getBindingResult();
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return new ApiError("Validation Error.", HttpStatus.BAD_REQUEST.value(), request.getServletPath(), errors);
    }
}