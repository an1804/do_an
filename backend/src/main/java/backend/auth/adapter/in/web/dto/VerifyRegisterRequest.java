package backend.auth.adapter.in.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyRegisterRequest {

    @Email(message = "Email khong hop le")
    @NotBlank(message = "Email khong duoc de trong")
    private String email;

    @Pattern(regexp = "^[0-9]{6}$", message = "Ma xac nhan phai gom 6 so")
    @NotBlank(message = "Ma xac nhan khong duoc de trong")
    private String code;
}
