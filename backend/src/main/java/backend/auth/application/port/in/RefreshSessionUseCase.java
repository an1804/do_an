package backend.auth.application.port.in;

import backend.auth.application.model.AuthResult;
import backend.auth.application.port.in.command.RefreshSessionCommand;

public interface RefreshSessionUseCase {
    AuthResult refresh(RefreshSessionCommand command);
}
