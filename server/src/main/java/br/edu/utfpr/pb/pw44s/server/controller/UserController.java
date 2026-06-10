package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import br.edu.utfpr.pb.pw44s.server.error.ApiError;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserDTO> listUsers(Pageable pageable) {
        return userService.findAll(pageable).map(UserDTO::new);
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