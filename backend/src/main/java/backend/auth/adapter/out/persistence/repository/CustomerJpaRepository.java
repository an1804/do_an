package backend.auth.adapter.out.persistence.repository;

import backend.auth.adapter.out.persistence.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerJpaRepository extends JpaRepository<CustomerEntity, Long> {
    boolean existsByPhone(String phone);

    @Query("select c from CustomerEntity c join fetch c.account where c.phone = :phone")
    Optional<CustomerEntity> findByPhoneWithAccount(@Param("phone") String phone);

    Optional<CustomerEntity> findByAccount_EmailIgnoreCase(String email);
}
