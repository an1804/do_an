package backend.auth.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    @JsonIgnore
    private String accessToken;
    @JsonIgnore
    private String refreshToken;
    private String role;
    private String email;
    private String fullName;
}
