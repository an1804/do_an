package backend.catalog.application.service;

import backend.catalog.application.port.in.command.CreateProductCommand;
import backend.catalog.application.port.in.command.UpdateProductCommand;
import backend.catalog.application.port.out.CatalogPort;
import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductSpec;
import backend.catalog.domain.model.ProductStatus;
import backend.shared.exception.CatalogException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CatalogUseCaseServiceTest {

    private FakeCatalogPort catalogPort;
    private CatalogUseCaseService useCase;

    @BeforeEach
    void setUp() {
        catalogPort = new FakeCatalogPort();
        catalogPort.ensureCategory("phone", "Dien thoai");
        catalogPort.ensureCategory("laptop", "Laptop");
        catalogPort.sellers.put("seller@techstore.local", 7L);
        useCase = new CatalogUseCaseService(catalogPort);
    }

    @Test
    void createPersistsActiveProductForSeller() {
        Product created = useCase.create(new CreateProductCommand(
                "seller@techstore.local",
                "iphone-16",
                "iPhone 16",
                "phone",
                20_000_000L,
                22_000_000L,
                "https://example.com/iphone.jpg",
                "Flagship Apple",
                List.of(new ProductSpec("Chip", "A18"))
        ));

        assertEquals("iphone-16", created.slug());
        assertEquals("phone", created.category());
        assertEquals(7L, created.sellerId());
        assertEquals(ProductStatus.ACTIVE, created.status());
        assertEquals(1, created.specs().size());
    }

    @Test
    void createRejectsDuplicateSlug() {
        useCase.create(samplePhone());

        CatalogException ex = assertThrows(CatalogException.class, () -> useCase.create(samplePhone()));
        assertEquals("Slug da ton tai", ex.getMessage());
    }

    @Test
    void publicListHidesDeletedProducts() {
        Product created = useCase.create(samplePhone());
        useCase.hide("seller@techstore.local", created.id());

        assertTrue(useCase.listPublic("phone", null).isEmpty());
        CatalogException ex = assertThrows(CatalogException.class, () -> useCase.getPublicBySlug("iphone-16"));
        assertEquals("Khong tim thay san pham", ex.getMessage());
    }

    @Test
    void sellerCannotUpdateSomeoneElseProduct() {
        Product created = useCase.create(samplePhone());
        catalogPort.sellers.put("other@techstore.local", 9L);

        CatalogException ex = assertThrows(CatalogException.class, () -> useCase.update(new UpdateProductCommand(
                "other@techstore.local",
                created.id(),
                "iphone-16",
                "iPhone 16",
                "phone",
                19_000_000L,
                null,
                "https://example.com/iphone.jpg",
                "Flagship Apple",
                List.of()
        )));
        assertEquals("Khong tim thay san pham", ex.getMessage());
    }

    private CreateProductCommand samplePhone() {
        return new CreateProductCommand(
                "seller@techstore.local",
                "iphone-16",
                "iPhone 16",
                "phone",
                20_000_000L,
                22_000_000L,
                "https://example.com/iphone.jpg",
                "Flagship Apple",
                List.of()
        );
    }

    private static final class FakeCatalogPort implements CatalogPort {
        private final Map<String, Category> categories = new LinkedHashMap<>();
        private final Map<Long, Product> products = new LinkedHashMap<>();
        private final Map<String, Long> sellers = new LinkedHashMap<>();
        private final AtomicLong ids = new AtomicLong(1);

        @Override
        public List<Category> loadCategories() {
            return List.copyOf(categories.values());
        }

        @Override
        public Optional<Category> loadCategoryBySlug(String slug) {
            return Optional.ofNullable(categories.get(slug));
        }

        @Override
        public void ensureCategory(String slug, String label) {
            categories.putIfAbsent(slug, new Category((long) categories.size() + 1, slug, label));
        }

        @Override
        public long countProducts() {
            return products.size();
        }

        @Override
        public List<Product> loadPublicProducts(String category, String query) {
            return products.values().stream()
                    .filter(product -> product.status() == ProductStatus.ACTIVE)
                    .filter(product -> category == null || category.equals(product.category()))
                    .filter(product -> query == null || product.name().toLowerCase().contains(query))
                    .toList();
        }

        @Override
        public Optional<Product> loadPublicProductBySlug(String slug) {
            return products.values().stream()
                    .filter(product -> product.slug().equals(slug) && product.status() == ProductStatus.ACTIVE)
                    .findFirst();
        }

        @Override
        public List<Product> loadSellerProducts(Long sellerId) {
            return products.values().stream()
                    .filter(product -> sellerId.equals(product.sellerId()))
                    .toList();
        }

        @Override
        public Optional<Product> loadSellerProduct(Long sellerId, Long productId) {
            return Optional.ofNullable(products.get(productId))
                    .filter(product -> sellerId.equals(product.sellerId()));
        }

        @Override
        public boolean existsSlug(String slug) {
            return products.values().stream().anyMatch(product -> product.slug().equals(slug));
        }

        @Override
        public boolean existsSlugForOther(String slug, Long productId) {
            return products.values().stream()
                    .anyMatch(product -> product.slug().equals(slug) && !product.id().equals(productId));
        }

        @Override
        public Optional<Long> findSellerIdByEmail(String email) {
            return Optional.ofNullable(sellers.get(email));
        }

        @Override
        public Product saveNew(Product product) {
            Product saved = copy(ids.getAndIncrement(), product);
            products.put(saved.id(), saved);
            return saved;
        }

        @Override
        public Product saveExisting(Product product) {
            products.put(product.id(), product);
            return product;
        }

        @Override
        public void updateStatus(Long productId, ProductStatus status) {
            Product current = products.get(productId);
            products.put(productId, new Product(
                    current.id(),
                    current.slug(),
                    current.name(),
                    current.category(),
                    current.sellerId(),
                    current.price(),
                    current.originalPrice(),
                    current.image(),
                    current.shortDescription(),
                    status,
                    current.specs()
            ));
        }

        private Product copy(Long id, Product product) {
            return new Product(
                    id,
                    product.slug(),
                    product.name(),
                    product.category(),
                    product.sellerId(),
                    product.price(),
                    product.originalPrice(),
                    product.image(),
                    product.shortDescription(),
                    product.status(),
                    product.specs() == null ? List.of() : new ArrayList<>(product.specs())
            );
        }
    }
}
