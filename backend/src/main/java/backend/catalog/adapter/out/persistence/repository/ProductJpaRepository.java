package backend.catalog.adapter.out.persistence.repository;

import backend.catalog.adapter.out.persistence.entity.ProductEntity;
import backend.catalog.domain.model.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductJpaRepository extends JpaRepository<ProductEntity, Long> {
    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    Optional<ProductEntity> findBySlugAndStatus(String slug, ProductStatus status);

    List<ProductEntity> findBySeller_IdOrderByIdDesc(Long sellerId);

    Optional<ProductEntity> findByIdAndSeller_Id(Long id, Long sellerId);

    @Query("""
            select distinct p from ProductEntity p
            join fetch p.category
            join fetch p.seller
            left join fetch p.specs
            where p.status = :status
              and (:categorySlug is null or p.category.slug = :categorySlug)
              and lower(p.name) like concat('%', lower(coalesce(:query, '')), '%')
            order by p.id asc
            """)
    List<ProductEntity> searchPublic(
            @Param("status") ProductStatus status,
            @Param("categorySlug") String categorySlug,
            @Param("query") String query
    );

    @Query("""
            select distinct p from ProductEntity p
            join fetch p.category
            join fetch p.seller
            left join fetch p.specs
            where p.seller.id = :sellerId
            order by p.id desc
            """)
    List<ProductEntity> findMine(@Param("sellerId") Long sellerId);

    @Query("""
            select p from ProductEntity p
            join fetch p.category
            join fetch p.seller
            left join fetch p.specs
            where p.slug = :slug and p.status = :status
            """)
    Optional<ProductEntity> findPublicBySlug(
            @Param("slug") String slug,
            @Param("status") ProductStatus status
    );

    @Query("""
            select p from ProductEntity p
            join fetch p.category
            join fetch p.seller
            left join fetch p.specs
            where p.id = :id and p.seller.id = :sellerId
            """)
    Optional<ProductEntity> findMineById(
            @Param("sellerId") Long sellerId,
            @Param("id") Long id
    );
}
