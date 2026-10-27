package backend.auth.adapter.out.security;

import backend.auth.application.port.out.AuthSecurityPort;
import backend.auth.domain.model.Account;
import backend.security.InMemoryTokenRevocationService;
import backend.security.JwtService;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthSecurityAdapter implements AuthSecurityPort {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InMemoryTokenRevocationService tokenRevocationService;

    public AuthSecurityAdapter(
            @Lazy AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            InMemoryTokenRevocationService tokenRevocationService
    ) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRevocationService = tokenRevocationService;
    }

    @Override
    public void authenticate(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    @Override
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    @Override
    public String generateAccessToken(Account account) {
        return jwtService.generateAccessToken(account);
    }

    @Override
    public String generateRefreshToken(Account account) {
        return jwtService.generateRefreshToken(account);
    }

    @Override
    public String rotateRefreshToken(Account account, String currentRefreshToken) {
        return jwtService.rotateRefreshToken(account, currentRefreshToken);
    }

    @Override
    public String extractUsername(String token) {
        return jwtService.extractUsername(token);
    }

    @Override
    public boolean isRefreshTokenValid(String token, Account account) {
        return jwtService.isRefreshTokenValid(token, account);
    }

    @Override
    public void revokeToken(String token) {
        tokenRevocationService.revoke(token);
    }

    @Override
    public boolean isTokenRevoked(String token) {
        return tokenRevocationService.isRevoked(token);
    }
}
