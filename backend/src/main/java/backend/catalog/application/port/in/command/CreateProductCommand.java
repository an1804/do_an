package backend.catalog.application.port.in.command;

import backend.catalog.domain.model.ProductSpec;

import java.util.List;

public record CreateProductCommand(
        String sellerEmail,
        String slug,
        String name,
        String category,
        Long price,
        Long originalPrice,
        String image,
        String shortDescription,
        List<ProductSpec> specs
) {
}
