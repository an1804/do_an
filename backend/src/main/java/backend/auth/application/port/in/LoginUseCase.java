package backend.auth.application.port.in;

import backend.auth.application.model.AuthResult;
import backend.auth.application.port.in.command.LoginCommand;

public interface LoginUseCase {
    AuthResult login(LoginCommand command);
}
