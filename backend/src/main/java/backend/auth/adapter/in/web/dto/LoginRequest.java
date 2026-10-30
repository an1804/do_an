package backend.auth.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email hoac so dien thoai khong duoc de trong")
    private String email;

    @NotBlank(message = "Mat khau khong duoc de trong")
    private String password;
}
