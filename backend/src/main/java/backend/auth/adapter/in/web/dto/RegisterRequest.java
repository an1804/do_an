package backend.auth.adapter.in.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Ho ten khong duoc de trong")
    private String fullName;

    @Email(message = "Email khong hop le")
    @NotBlank(message = "Email khong duoc de trong")
    private String email;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "So dien thoai khong hop le")
    @NotBlank(message = "So dien thoai khong duoc de trong")
    private String phone;

    @Size(min = 6, message = "Mat khau phai co it nhat 6 ky tu")
    @NotBlank(message = "Mat khau khong duoc de trong")
    private String password;
}
