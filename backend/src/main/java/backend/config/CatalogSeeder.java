package backend.config;

import backend.catalog.application.port.out.CatalogPort;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductSpec;
import backend.catalog.domain.model.ProductStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@Order(2)
public class CatalogSeeder implements CommandLineRunner {

    private static final List<String[]> CATEGORIES = List.of(
            new String[]{"phone", "Điện thoại"},
            new String[]{"laptop", "Laptop"},
            new String[]{"accessory", "Phụ kiện"},
            new String[]{"smartwatch", "Smartwatch"},
            new String[]{"tablet", "Tablet"},
            new String[]{"monitor", "Màn hình"},
            new String[]{"tv", "TV"}
    );

    private final CatalogPort catalogPort;
    private final ObjectMapper objectMapper;
    private final String sellerEmail;

    public CatalogSeeder(
            CatalogPort catalogPort,
            ObjectMapper objectMapper,
            @Value("${app.seed.seller-email}") String sellerEmail
    ) {
        this.catalogPort = catalogPort;
        this.objectMapper = objectMapper;
        this.sellerEmail = sellerEmail;
    }

    @Override
    public void run(String... args) throws Exception {
        for (String[] category : CATEGORIES) {
            catalogPort.ensureCategory(category[0], category[1]);
        }
        if (catalogPort.countProducts() > 0) {
            return;
        }
        Long sellerId = catalogPort.findSellerIdByEmail(sellerEmail)
                .orElse(null);
        if (sellerId == null) {
            return;
        }
        try (InputStream input = new ClassPathResource("catalog-seed.json").getInputStream()) {
            List<SeedProduct> seeds = objectMapper.readValue(input, new TypeReference<>() {});
            for (SeedProduct seed : seeds) {
                if (catalogPort.existsSlug(seed.slug())) {
                    continue;
                }
                List<ProductSpec> specs = seed.specs() == null
                        ? List.of()
                        : seed.specs().stream()
                                .map(spec -> new ProductSpec(spec.label(), spec.value()))
                                .toList();
                catalogPort.saveNew(new Product(
                        null,
                        seed.slug(),
                        seed.name(),
                        seed.category(),
                        sellerId,
                        seed.price(),
                        seed.originalPrice(),
                        seed.image(),
                        seed.shortDescription(),
                        ProductStatus.ACTIVE,
                        specs
                ));
            }
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SeedProduct(
            String slug,
            String name,
            String category,
            long price,
            Long originalPrice,
            String image,
            String shortDescription,
            List<SeedSpec> specs
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SeedSpec(String label, String value) {
    }
}
