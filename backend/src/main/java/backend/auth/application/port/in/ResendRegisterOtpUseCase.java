package backend.auth.application.port.in;

import backend.auth.application.model.RegisterOtpResult;

public interface ResendRegisterOtpUseCase {
    RegisterOtpResult resendOtp(String email);
}
