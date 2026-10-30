package backend.auth.adapter.out.persistence;

import backend.auth.adapter.out.persistence.entity.RegisterOtpEntity;
import backend.auth.adapter.out.persistence.repository.RegisterOtpJpaRepository;
import backend.auth.application.model.RegisterOtpChallenge;
import backend.auth.application.port.out.RegisterOtpPort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class RegisterOtpPersistenceAdapter implements RegisterOtpPort {

    private final RegisterOtpJpaRepository registerOtpJpaRepository;

    public RegisterOtpPersistenceAdapter(RegisterOtpJpaRepository registerOtpJpaRepository) {
        this.registerOtpJpaRepository = registerOtpJpaRepository;
    }

    @Override
    @Transactional
    public void save(RegisterOtpChallenge challenge) {
        RegisterOtpEntity entity = registerOtpJpaRepository.findByEmailIgnoreCase(challenge.email())
                .orElseGet(RegisterOtpEntity::new);
        entity.setEmail(challenge.email());
        entity.setPhone(challenge.phone());
        entity.setFullName(challenge.fullName());
        entity.setPasswordHash(challenge.passwordHash());
        entity.setCodeHash(challenge.codeHash());
        entity.setExpiresAt(challenge.expiresAt());
        entity.setSentAt(challenge.sentAt());
        entity.setAttemptCount(challenge.attemptCount());
        registerOtpJpaRepository.save(entity);
    }

    @Override
    public Optional<RegisterOtpChallenge> findByEmail(String email) {
        return registerOtpJpaRepository.findByEmailIgnoreCase(email).map(this::toChallenge);
    }

    @Override
    public Optional<RegisterOtpChallenge> findByPhone(String phone) {
        return registerOtpJpaRepository.findByPhone(phone).map(this::toChallenge);
    }

    @Override
    @Transactional
    public void deleteByEmail(String email) {
        registerOtpJpaRepository.deleteByEmailIgnoreCase(email);
    }

    private RegisterOtpChallenge toChallenge(RegisterOtpEntity entity) {
        return new RegisterOtpChallenge(
                entity.getEmail(),
                entity.getPhone(),
                entity.getFullName(),
                entity.getPasswordHash(),
                entity.getCodeHash(),
                entity.getExpiresAt(),
                entity.getSentAt(),
                entity.getAttemptCount()
        );
    }
}
