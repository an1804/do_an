package backend.catalog.application.service;

import backend.catalog.application.port.in.CreateProductUseCase;
import backend.catalog.application.port.in.GetPublicProductUseCase;
import backend.catalog.application.port.in.HideProductUseCase;
import backend.catalog.application.port.in.ListCategoriesUseCase;
import backend.catalog.application.port.in.ListPublicProductsUseCase;
import backend.catalog.application.port.in.ListSellerProductsUseCase;
import backend.catalog.application.port.in.UpdateProductUseCase;
import backend.catalog.application.port.in.command.CreateProductCommand;
import backend.catalog.application.port.in.command.UpdateProductCommand;
import backend.catalog.application.port.out.CatalogPort;
import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductSpec;
import backend.catalog.domain.model.ProductStatus;
import backend.shared.exception.CatalogException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class CatalogUseCaseService implements
        ListPublicProductsUseCase,
        GetPublicProductUseCase,
        ListCategoriesUseCase,
        ListSellerProductsUseCase,
        CreateProductUseCase,
        UpdateProductUseCase,
        HideProductUseCase {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    private final CatalogPort catalogPort;

    public CatalogUseCaseService(CatalogPort catalogPort) {
        this.catalogPort = catalogPort;
    }

    @Override
    public List<Product> listPublic(String category, String query) {
        String normalizedCategory = blankToNull(category);
        if (normalizedCategory != null) {
            catalogPort.loadCategoryBySlug(normalizedCategory)
                    .orElseThrow(() -> new CatalogException(HttpStatus.BAD_REQUEST, "Danh muc khong hop le"));
        }
        return catalogPort.loadPublicProducts(normalizedCategory, blankToNull(query));
    }

    @Override
    public Product getPublicBySlug(String slug) {
        return catalogPort.loadPublicProductBySlug(required(slug, "Slug khong duoc de trong"))
                .orElseThrow(() -> new CatalogException(HttpStatus.NOT_FOUND, "Khong tim thay san pham"));
    }

    @Override
    public List<Category> listCategories() {
        return catalogPort.loadCategories();
    }

    @Override
    public List<Product> listMine(String sellerEmail) {
        return catalogPort.loadSellerProducts(requireSellerId(sellerEmail));
    }

    @Override
    @Transactional
    public Product create(CreateProductCommand command) {
        Long sellerId = requireSellerId(command.sellerEmail());
        String slug = normalizeSlug(command.slug());
        if (catalogPort.existsSlug(slug)) {
            throw new CatalogException(HttpStatus.BAD_REQUEST, "Slug da ton tai");
        }
        Product product = new Product(
                null,
                slug,
                required(command.name(), "Ten san pham khong duoc de trong"),
                requireCategory(command.category()),
                sellerId,
                requirePrice(command.price()),
                normalizeOriginalPrice(command.originalPrice()),
                required(command.image(), "Anh san pham khong duoc de trong"),
                required(command.shortDescription(), "Mo ta ngan khong duoc de trong"),
                ProductStatus.ACTIVE,
                normalizeSpecs(command.specs())
        );
        return catalogPort.saveNew(product);
    }

    @Override
    @Transactional
    public Product update(UpdateProductCommand command) {
        Long sellerId = requireSellerId(command.sellerEmail());
        Product existing = catalogPort.loadSellerProduct(sellerId, command.productId())
                .orElseThrow(() -> new CatalogException(HttpStatus.NOT_FOUND, "Khong tim thay san pham"));
        String slug = normalizeSlug(command.slug());
        if (catalogPort.existsSlugForOther(slug, existing.id())) {
            throw new CatalogException(HttpStatus.BAD_REQUEST, "Slug da ton tai");
        }
        Product updated = new Product(
                existing.id(),
                slug,
                required(command.name(), "Ten san pham khong duoc de trong"),
                requireCategory(command.category()),
                existing.sellerId(),
                requirePrice(command.price()),
                normalizeOriginalPrice(command.originalPrice()),
                required(command.image(), "Anh san pham khong duoc de trong"),
                required(command.shortDescription(), "Mo ta ngan khong duoc de trong"),
                existing.status(),
                normalizeSpecs(command.specs())
        );
        return catalogPort.saveExisting(updated);
    }

    @Override
    @Transactional
    public void hide(String sellerEmail, Long productId) {
        Long sellerId = requireSellerId(sellerEmail);
        catalogPort.loadSellerProduct(sellerId, productId)
                .orElseThrow(() -> new CatalogException(HttpStatus.NOT_FOUND, "Khong tim thay san pham"));
        catalogPort.updateStatus(productId, ProductStatus.HIDDEN);
    }

    private Long requireSellerId(String email) {
        String normalized = required(email, "Phien dang nhap khong hop le").toLowerCase(Locale.ROOT);
        return catalogPort.findSellerIdByEmail(normalized)
                .orElseThrow(() -> new CatalogException(HttpStatus.FORBIDDEN, "Tai khoan khong phai seller"));
    }

    private String requireCategory(String slug) {
        String normalized = required(slug, "Danh muc khong duoc de trong").toLowerCase(Locale.ROOT);
        catalogPort.loadCategoryBySlug(normalized)
                .orElseThrow(() -> new CatalogException(HttpStatus.BAD_REQUEST, "Danh muc khong hop le"));
        return normalized;
    }

    private String normalizeSlug(String slug) {
        String value = required(slug, "Slug khong duoc de trong").toLowerCase(Locale.ROOT).trim();
        if (!SLUG_PATTERN.matcher(value).matches()) {
            throw new CatalogException(HttpStatus.BAD_REQUEST, "Slug khong hop le");
        }
        return value;
    }

    private long requirePrice(Long price) {
        if (price == null || price <= 0) {
            throw new CatalogException(HttpStatus.BAD_REQUEST, "Gia san pham khong hop le");
        }
        return price;
    }

    private Long normalizeOriginalPrice(Long originalPrice) {
        if (originalPrice == null || originalPrice <= 0) {
            return null;
        }
        return originalPrice;
    }

    private List<ProductSpec> normalizeSpecs(List<ProductSpec> specs) {
        if (specs == null || specs.isEmpty()) {
            return List.of();
        }
        return specs.stream()
                .filter(spec -> spec != null && notBlank(spec.label()) && notBlank(spec.value()))
                .map(spec -> new ProductSpec(spec.label().trim(), spec.value().trim()))
                .toList();
    }

    private String required(String value, String message) {
        if (!notBlank(value)) {
            throw new CatalogException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (!notBlank(value)) {
            return null;
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }
}
