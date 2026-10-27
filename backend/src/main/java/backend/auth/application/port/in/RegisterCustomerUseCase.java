package backend.auth.application.port.in;

import backend.auth.application.model.AuthResult;
import backend.auth.application.port.in.command.RegisterCustomerCommand;

public interface RegisterCustomerUseCase {
    AuthResult register(RegisterCustomerCommand command);
}
