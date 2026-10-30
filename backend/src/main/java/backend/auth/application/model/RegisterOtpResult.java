package backend.auth.application.model;

public record RegisterOtpResult(String email, int expiresInSeconds) {
}
