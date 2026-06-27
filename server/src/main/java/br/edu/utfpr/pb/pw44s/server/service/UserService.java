package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Authority;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AuthorityRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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

        //user.setActive(false);
        //user.setUserAuthorities(Collections.emptySet());

        user.setActive(true);
        Authority roleCliente = authorityRepository.findByAuthority("ROLE_CLIENTE");
        user.setUserAuthorities(Set.of(roleCliente));

        log.info("Novo usuário cadastrado | username: {}", user.getUsername());

        this.userRepository.save(user);
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