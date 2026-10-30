package backend.auth.application.port.out;

import backend.auth.application.model.RegisterOtpChallenge;

import java.util.Optional;

public interface RegisterOtpPort {
    void save(RegisterOtpChallenge challenge);

    Optional<RegisterOtpChallenge> findByEmail(String email);

    Optional<RegisterOtpChallenge> findByPhone(String phone);

    void deleteByEmail(String email);
}
