package backend.catalog.adapter.out.persistence;

import backend.catalog.adapter.out.persistence.entity.CategoryEntity;
import backend.catalog.adapter.out.persistence.entity.ProductEntity;
import backend.catalog.adapter.out.persistence.entity.ProductSpecEntity;
import backend.catalog.domain.model.Category;
import backend.catalog.domain.model.Product;
import backend.catalog.domain.model.ProductSpec;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

final class CatalogPersistenceMapper {

    private CatalogPersistenceMapper() {
    }

    static Category toCategory(CategoryEntity entity) {
        return new Category(entity.getId(), entity.getSlug(), entity.getLabel());
    }

    static Product toProduct(ProductEntity entity) {
        List<ProductSpec> specs = entity.getSpecs() == null
                ? List.of()
                : entity.getSpecs().stream()
                        .sorted(Comparator.comparingInt(ProductSpecEntity::getSortOrder))
                        .map(spec -> new ProductSpec(spec.getLabel(), spec.getValue()))
                        .toList();
        return new Product(
                entity.getId(),
                entity.getSlug(),
                entity.getName(),
                entity.getCategory().getSlug(),
                entity.getSeller().getId(),
                entity.getPrice(),
                entity.getOriginalPrice(),
                entity.getImage(),
                entity.getShortDescription(),
                entity.getStatus(),
                specs
        );
    }

    static void replaceSpecs(ProductEntity entity, List<ProductSpec> specs) {
        entity.getSpecs().clear();
        if (specs == null || specs.isEmpty()) {
            return;
        }
        List<ProductSpecEntity> next = new ArrayList<>();
        for (int i = 0; i < specs.size(); i++) {
            ProductSpec spec = specs.get(i);
            ProductSpecEntity row = new ProductSpecEntity();
            row.setProduct(entity);
            row.setLabel(spec.label());
            row.setValue(spec.value());
            row.setSortOrder(i);
            next.add(row);
        }
        entity.getSpecs().addAll(next);
    }
}
