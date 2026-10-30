package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.SellerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerJpaRepository extends JpaRepository<SellerEntity, Long> {
    Optional<SellerEntity> findByAccount_EmailIgnoreCase(String email);
}
