package backend.auth.application.model;

public record AuthResult(
        String accessToken,
        String refreshToken,
        String role,
        String email,
        String fullName
) {
}
