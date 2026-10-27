package backend.auth.application.port.out;

import backend.auth.domain.model.Account;

public interface AuthSecurityPort {
    void authenticate(String email, String password);

    String encodePassword(String rawPassword);

    String generateAccessToken(Account account);

    String generateRefreshToken(Account account);

    String rotateRefreshToken(Account account, String currentRefreshToken);

    String extractUsername(String token);

    boolean isRefreshTokenValid(String token, Account account);

    void revokeToken(String token);

    boolean isTokenRevoked(String token);
}
