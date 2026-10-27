package backend.security;

import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String TOKEN_TYPE_CLAIM = "token_type";
    private static final String SESSION_STARTED_AT_CLAIM = "session_started_at";
    private static final String ROLE_CLAIM = "role";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";
    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 15;
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7;
    private static final long ABSOLUTE_SESSION_EXPIRATION = 1000L * 60 * 60 * 24 * 30;

    private final SecretKey signInKey;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.signInKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public String generateAccessToken(Account account) {
        Map<String, Object> claims = identityClaims(account.role());
        claims.put(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE);
        long now = System.currentTimeMillis();
        return buildToken(claims, account.email(), now, now + ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(Account account) {
        long now = System.currentTimeMillis();
        return buildRefreshToken(account, now, now);
    }

    public String rotateRefreshToken(Account account, String currentRefreshToken) {
        Number sessionStartedAtClaim = extractClaim(
                currentRefreshToken,
                claims -> claims.get(SESSION_STARTED_AT_CLAIM, Number.class)
        );
        if (sessionStartedAtClaim == null) {
            throw new JwtException("Refresh token khong co thong tin phien dang nhap");
        }
        long now = System.currentTimeMillis();
        long sessionStartedAt = sessionStartedAtClaim.longValue();
        if (now >= sessionStartedAt + ABSOLUTE_SESSION_EXPIRATION) {
            throw new JwtException("Phien dang nhap da het han tuyet doi");
        }
        return buildRefreshToken(account, sessionStartedAt, now);
    }

    public boolean isAccessTokenValid(String token, UserDetails userDetails) {
        return isTokenValid(token, userDetails, ACCESS_TOKEN_TYPE);
    }

    public boolean isRefreshTokenValid(String token, Account account) {
        try {
            String username = extractUsername(token);
            String tokenType = extractClaim(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class));
            return username.equals(account.email())
                    && REFRESH_TOKEN_TYPE.equals(tokenType)
                    && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private boolean isTokenValid(String token, UserDetails userDetails, String expectedType) {
        try {
            String username = extractUsername(token);
            String tokenType = extractClaim(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class));
            return username.equals(userDetails.getUsername())
                    && expectedType.equals(tokenType)
                    && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private String buildRefreshToken(Account account, long sessionStartedAt, long issuedAt) {
        long absoluteExpiration = sessionStartedAt + ABSOLUTE_SESSION_EXPIRATION;
        long expiration = Math.min(issuedAt + REFRESH_TOKEN_EXPIRATION, absoluteExpiration);
        Map<String, Object> claims = identityClaims(account.role());
        claims.put(TOKEN_TYPE_CLAIM, REFRESH_TOKEN_TYPE);
        claims.put(SESSION_STARTED_AT_CLAIM, sessionStartedAt);
        return buildToken(claims, account.email(), issuedAt, expiration);
    }

    private Map<String, Object> identityClaims(Role role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(ROLE_CLAIM, role == null ? Role.CUSTOMER.name() : role.name());
        return claims;
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long issuedAt, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .id(UUID.randomUUID().toString())
                .subject(subject)
                .issuedAt(new Date(issuedAt))
                .expiration(new Date(expiration))
                .signWith(signInKey)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signInKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
