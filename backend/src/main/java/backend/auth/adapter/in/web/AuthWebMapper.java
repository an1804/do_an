package backend.auth.adapter.in.web;

import backend.auth.adapter.in.web.dto.AuthResponse;
import backend.auth.application.model.AuthResult;

final class AuthWebMapper {

    private AuthWebMapper() {
    }

    static AuthResponse toResponse(AuthResult result) {
        return AuthResponse.builder()
                .accessToken(result.accessToken())
                .refreshToken(result.refreshToken())
                .role(result.role())
                .email(result.email())
                .fullName(result.fullName())
                .phone(result.phone())
                .build();
    }
}
