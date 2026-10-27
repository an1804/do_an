package backend.auth.application.port.in;

import backend.auth.application.model.SessionResult;

public interface GetSessionUseCase {
    SessionResult getSession(String email);
}
