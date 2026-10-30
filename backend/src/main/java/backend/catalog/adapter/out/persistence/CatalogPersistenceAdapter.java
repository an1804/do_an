package backend.catalog.adapter.out.persistence;

import backend.auth.adapter.out.persistence.entity.SellerEntity;
import backend.auth.adapter.out.persistence.repository.SellerJpaRepository;
import backend.catalog.adapter.out.persistence.entity.CategoryEntity;
import backend.catalog.adapter.out.persistence.entity.ProductEntity;
import backend.catalog.adapter.out.persistence.repository.CategoryJpaRepository;
import backend.catalog.adapter.out.persistence.repository.ProductJpaRepository;
import backend.catalog.application.port.out.CatalogPort;
import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductStatus;
import backend.shared.exception.CatalogException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@Transactional(readOnly = true)
public class CatalogPersistenceAdapter implements CatalogPort {

    private final CategoryJpaRepository categoryJpaRepository;
    private final ProductJpaRepository productJpaRepository;
    private final SellerJpaRepository sellerJpaRepository;

    public CatalogPersistenceAdapter(
            CategoryJpaRepository categoryJpaRepository,
            ProductJpaRepository productJpaRepository,
            SellerJpaRepository sellerJpaRepository
    ) {
        this.categoryJpaRepository = categoryJpaRepository;
        this.productJpaRepository = productJpaRepository;
        this.sellerJpaRepository = sellerJpaRepository;
    }

    @Override
    public List<Category> loadCategories() {
        return categoryJpaRepository.findAllByOrderByIdAsc().stream()
                .map(CatalogPersistenceMapper::toCategory)
                .toList();
    }

    @Override
    public Optional<Category> loadCategoryBySlug(String slug) {
        return categoryJpaRepository.findBySlug(slug).map(CatalogPersistenceMapper::toCategory);
    }

    @Override
    @Transactional
    public void ensureCategory(String slug, String label) {
        if (categoryJpaRepository.existsBySlug(slug)) {
            return;
        }
        CategoryEntity entity = new CategoryEntity();
        entity.setSlug(slug);
        entity.setLabel(label);
        categoryJpaRepository.save(entity);
    }

    @Override
    public long countProducts() {
        return productJpaRepository.count();
    }

    @Override
    public List<Product> loadPublicProducts(String category, String query) {
        return productJpaRepository.searchPublic(ProductStatus.ACTIVE, category, query).stream()
                .map(CatalogPersistenceMapper::toProduct)
                .toList();
    }

    @Override
    public Optional<Product> loadPublicProductBySlug(String slug) {
        return productJpaRepository.findPublicBySlug(slug, ProductStatus.ACTIVE)
                .map(CatalogPersistenceMapper::toProduct);
    }

    @Override
    public List<Product> loadSellerProducts(Long sellerId) {
        return productJpaRepository.findMine(sellerId).stream()
                .map(CatalogPersistenceMapper::toProduct)
                .toList();
    }

    @Override
    public Optional<Product> loadSellerProduct(Long sellerId, Long productId) {
        return productJpaRepository.findMineById(sellerId, productId)
                .map(CatalogPersistenceMapper::toProduct);
    }

    @Override
    public boolean existsSlug(String slug) {
        return productJpaRepository.existsBySlug(slug);
    }

    @Override
    public boolean existsSlugForOther(String slug, Long productId) {
        return productJpaRepository.existsBySlugAndIdNot(slug, productId);
    }

    @Override
    public Optional<Long> findSellerIdByEmail(String email) {
        return sellerJpaRepository.findByAccount_EmailIgnoreCase(email).map(SellerEntity::getId);
    }

    @Override
    @Transactional
    public Product saveNew(Product product) {
        ProductEntity entity = new ProductEntity();
        apply(entity, product);
        return CatalogPersistenceMapper.toProduct(productJpaRepository.save(entity));
    }

    @Override
    @Transactional
    public Product saveExisting(Product product) {
        ProductEntity entity = productJpaRepository.findById(product.id())
                .orElseThrow(() -> new CatalogException(HttpStatus.NOT_FOUND, "Khong tim thay san pham"));
        apply(entity, product);
        return CatalogPersistenceMapper.toProduct(productJpaRepository.save(entity));
    }

    @Override
    @Transactional
    public void updateStatus(Long productId, ProductStatus status) {
        ProductEntity entity = productJpaRepository.findById(productId)
                .orElseThrow(() -> new CatalogException(HttpStatus.NOT_FOUND, "Khong tim thay san pham"));
        entity.setStatus(status);
        productJpaRepository.save(entity);
    }

    private void apply(ProductEntity entity, Product product) {
        CategoryEntity category = categoryJpaRepository.findBySlug(product.category())
                .orElseThrow(() -> new CatalogException(HttpStatus.BAD_REQUEST, "Danh muc khong hop le"));
        SellerEntity seller = sellerJpaRepository.findById(product.sellerId())
                .orElseThrow(() -> new CatalogException(HttpStatus.FORBIDDEN, "Tai khoan khong phai seller"));
        entity.setSlug(product.slug());
        entity.setName(product.name());
        entity.setCategory(category);
        entity.setSeller(seller);
        entity.setPrice(product.price());
        entity.setOriginalPrice(product.originalPrice());
        entity.setImage(product.image());
        entity.setShortDescription(product.shortDescription());
        entity.setStatus(product.status());
        CatalogPersistenceMapper.replaceSpecs(entity, product.specs());
    }
}
