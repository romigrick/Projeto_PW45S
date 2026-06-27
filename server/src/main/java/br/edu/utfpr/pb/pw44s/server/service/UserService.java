package br.edu.utfpr.pb.pw44s.server.service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.utfpr.pb.pw44s.server.dto.GoogleAuthRequest;
import br.edu.utfpr.pb.pw44s.server.model.Authority;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AuthorityRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorityRepository authorityRepository;

    public UserService(UserRepository userRepository, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.authorityRepository = authorityRepository;
    }

    @Transactional
    public void save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // user.setActive(false);
        // user.setUserAuthorities(Collections.emptySet());

        user.setActive(true);
        Authority roleCliente = authorityRepository.findByAuthority("ROLE_CLIENTE");
        user.setUserAuthorities(Set.of(roleCliente));

        log.info("Novo usuário cadastrado | username: {}", user.getUsername());

        this.userRepository.save(user);
    }

    @Transactional
    public User findOrCreateGoogleUser(GoogleAuthRequest request) {
        // Busca primeiro por email, que é o identificador real da conta Google.
        // Isso cobre o caso de contas criadas manualmente, cujo username
        // pode ser diferente do email.
        User existing = userRepository.findUserByEmail(request.getEmail());

        if (existing == null) {
            // Fallback: caso existam registros antigos onde username == email
            existing = userRepository.findUserByUsername(request.getEmail());
        }

        if (existing != null) {
            // Usuário já existe — vincula a conta ao login do Google atualizando
            // a senha para a gerada pelo Google, para garantir que logins
            // futuros via Google sempre funcionem. O username original é preservado.
            existing.setPassword(passwordEncoder.encode(request.getGeneratedPassword()));
            return userRepository.save(existing);
        }

        // Novo usuário — cria normalmente
        User user = new User();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getDisplayName());
        user.setPassword(passwordEncoder.encode(request.getGeneratedPassword()));
        user.setActive(true);

        Authority roleCliente = authorityRepository.findByAuthority("ROLE_CLIENTE");
        user.setUserAuthorities(Set.of(roleCliente));

        log.info("Novo usuário cadastrado via Google | username: {}", user.getUsername());

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public void activateUserAndSetRole(Long id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Set<Authority> authorities = new HashSet<>();
        Authority auth = authorityRepository.findByAuthority(roleName);

        if (auth == null) {
            throw new IllegalArgumentException("Permissão " + roleName + " não existe.");
        }

        authorities.add(auth);

        user.setUserAuthorities(authorities);
        user.setActive(true);

        log.info("Usuário ativado | username: {} | permissão: {}", user.getUsername(), roleName);

        userRepository.save(user);
    }

    @Transactional
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        user.setActive(false);
        user.setUserAuthorities(Collections.emptySet());

        log.info("Usuário desativado | username: {}", user.getUsername());

        userRepository.save(user);
    }
}