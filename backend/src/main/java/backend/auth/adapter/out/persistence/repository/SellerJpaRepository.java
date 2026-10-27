package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.SellerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerJpaRepository extends JpaRepository<SellerEntity, Long> {
}
