package backend.catalog.adapter.out.persistence.repository;

import backend.catalog.adapter.out.persistence.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryJpaRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<CategoryEntity> findAllByOrderByIdAsc();
}
