package backend.auth.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterOtpResponse {
    private String email;
    private int expiresInSeconds;
    private String message;
}
