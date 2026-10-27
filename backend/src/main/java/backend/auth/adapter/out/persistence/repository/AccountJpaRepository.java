package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountJpaRepository extends JpaRepository<AccountEntity, Long> {
    boolean existsByEmailIgnoreCase(String email);

    Optional<AccountEntity> findByEmailIgnoreCase(String email);
}
