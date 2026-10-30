package backend.auth.application.model;

import java.time.Instant;

public record RegisterOtpChallenge(
        String email,
        String phone,
        String fullName,
        String passwordHash,
        String codeHash,
        Instant expiresAt,
        Instant sentAt,
        int attemptCount
) {
    public RegisterOtpChallenge withCode(String newCodeHash, Instant newExpiresAt, Instant newSentAt) {
        return new RegisterOtpChallenge(
                email,
                phone,
                fullName,
                passwordHash,
                newCodeHash,
                newExpiresAt,
                newSentAt,
                0
        );
    }

    public RegisterOtpChallenge withAttemptCount(int nextAttemptCount) {
        return new RegisterOtpChallenge(
                email,
                phone,
                fullName,
                passwordHash,
                codeHash,
                expiresAt,
                sentAt,
                nextAttemptCount
        );
    }
}
