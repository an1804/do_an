package backend.catalog.adapter.in.web;

import backend.catalog.adapter.in.web.dto.CategoryResponse;
import backend.catalog.adapter.in.web.dto.ProductResponse;
import backend.catalog.adapter.in.web.dto.ProductSpecRequest;
import backend.catalog.adapter.in.web.dto.ProductSpecResponse;
import backend.catalog.adapter.in.web.dto.UpsertProductRequest;
import backend.catalog.application.port.in.command.CreateProductCommand;
import backend.catalog.application.port.in.command.UpdateProductCommand;
import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductSpec;

import java.util.List;

final class CatalogWebMapper {

    private CatalogWebMapper() {
    }

    static ProductResponse toResponse(Product product) {
        List<ProductSpecResponse> specs = product.specs() == null
                ? List.of()
                : product.specs().stream()
                        .map(spec -> new ProductSpecResponse(spec.label(), spec.value()))
                        .toList();
        return ProductResponse.builder()
                .id(String.valueOf(product.id()))
                .slug(product.slug())
                .name(product.name())
                .category(product.category())
                .price(product.price())
                .originalPrice(product.originalPrice())
                .image(product.image())
                .shortDescription(product.shortDescription())
                .status(product.status().name())
                .specs(specs)
                .build();
    }

    static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.slug(), category.label());
    }

    static CreateProductCommand toCreateCommand(String sellerEmail, UpsertProductRequest request) {
        return new CreateProductCommand(
                sellerEmail,
                request.getSlug(),
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getOriginalPrice(),
                request.getImage(),
                request.getShortDescription(),
                toSpecs(request.getSpecs())
        );
    }

    static UpdateProductCommand toUpdateCommand(String sellerEmail, Long productId, UpsertProductRequest request) {
        return new UpdateProductCommand(
                sellerEmail,
                productId,
                request.getSlug(),
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getOriginalPrice(),
                request.getImage(),
                request.getShortDescription(),
                toSpecs(request.getSpecs())
        );
    }

    private static List<ProductSpec> toSpecs(List<ProductSpecRequest> specs) {
        if (specs == null || specs.isEmpty()) {
            return List.of();
        }
        return specs.stream()
                .map(spec -> new ProductSpec(spec.getLabel(), spec.getValue()))
                .toList();
    }
}
