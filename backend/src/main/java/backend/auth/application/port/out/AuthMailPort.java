package backend.auth.application.port.out;

public interface AuthMailPort {
    void sendRegisterOtp(String toEmail, String fullName, String code);
}
