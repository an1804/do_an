package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.RegisterOtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterOtpJpaRepository extends JpaRepository<RegisterOtpEntity, Long> {
    Optional<RegisterOtpEntity> findByEmailIgnoreCase(String email);

    Optional<RegisterOtpEntity> findByPhone(String phone);

    void deleteByEmailIgnoreCase(String email);
}
