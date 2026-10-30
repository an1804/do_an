package backend.auth.application.port.in;

import backend.auth.application.model.AuthResult;
import backend.auth.application.port.in.command.VerifyRegisterOtpCommand;

public interface VerifyRegisterOtpUseCase {
    AuthResult verifyOtp(VerifyRegisterOtpCommand command);
}
