package backend.auth.application.port.in;

import backend.auth.application.model.RegisterOtpResult;
import backend.auth.application.port.in.command.RegisterCustomerCommand;

public interface RequestRegisterOtpUseCase {
    RegisterOtpResult requestOtp(RegisterCustomerCommand command);
}
