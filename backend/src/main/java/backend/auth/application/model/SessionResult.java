package backend.auth.application.model;

public record SessionResult(
        String role,
        String email,
        String fullName,
        String phone
) {
}
