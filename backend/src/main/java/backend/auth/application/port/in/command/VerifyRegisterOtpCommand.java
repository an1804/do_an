package backend.auth.application.port.in.command;

public record VerifyRegisterOtpCommand(String email, String code) {
}
