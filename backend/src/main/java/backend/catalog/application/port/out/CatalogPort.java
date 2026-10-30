package backend.catalog.application.port.out;

import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductStatus;

import java.util.List;
import java.util.Optional;

public interface CatalogPort {
    List<Category> loadCategories();

    Optional<Category> loadCategoryBySlug(String slug);

    void ensureCategory(String slug, String label);

    long countProducts();

    List<Product> loadPublicProducts(String category, String query);

    Optional<Product> loadPublicProductBySlug(String slug);

    List<Product> loadSellerProducts(Long sellerId);

    Optional<Product> loadSellerProduct(Long sellerId, Long productId);

    boolean existsSlug(String slug);

    boolean existsSlugForOther(String slug, Long productId);

    Optional<Long> findSellerIdByEmail(String email);

    Product saveNew(Product product);

    Product saveExisting(Product product);

    void updateStatus(Long productId, ProductStatus status);
}
