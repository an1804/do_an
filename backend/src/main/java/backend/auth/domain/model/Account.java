package backend.auth.domain.model;

public record Account(
        Long id,
        String email,
        String passwordHash,
        String fullName,
        Role role,
        boolean enabled
) {
}
