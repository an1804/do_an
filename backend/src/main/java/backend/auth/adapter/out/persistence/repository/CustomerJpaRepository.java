package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerJpaRepository extends JpaRepository<CustomerEntity, Long> {
    boolean existsByPhone(String phone);
}
