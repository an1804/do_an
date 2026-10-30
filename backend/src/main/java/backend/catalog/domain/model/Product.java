package backend.catalog.domain.model;

import java.util.List;

public record Product(
        Long id,
        String slug,
        String name,
        String category,
        Long sellerId,
        long price,
        Long originalPrice,
        String image,
        String shortDescription,
        ProductStatus status,
        List<ProductSpec> specs
) {
}
