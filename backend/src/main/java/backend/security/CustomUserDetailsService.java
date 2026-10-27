package backend.security;

import backend.auth.adapter.out.persistence.repository.AccountJpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountJpaRepository accountJpaRepository;

    public CustomUserDetailsService(AccountJpaRepository accountJpaRepository) {
        this.accountJpaRepository = accountJpaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return accountJpaRepository.findByEmailIgnoreCase(username)
                .map(account -> User.builder()
                        .username(account.getEmail())
                        .password(account.getPasswordHash())
                        .disabled(!account.isEnabled())
                        .roles(account.getRole().name())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Khong tim thay tai khoan voi email: " + username
                ));
    }
}
