package backend.security;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InMemoryTokenRevocationService {

    private final Set<String> revoked = ConcurrentHashMap.newKeySet();

    public void revoke(String token) {
        if (token != null && !token.isBlank()) {
            revoked.add(token);
        }
    }

    public boolean isRevoked(String token) {
        return token != null && revoked.contains(token);
    }
}
