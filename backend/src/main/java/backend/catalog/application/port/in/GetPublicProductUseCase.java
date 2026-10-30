package backend.catalog.application.port.in;

import backend.catalog.domain.model.Product;

public interface GetPublicProductUseCase {
    Product getPublicBySlug(String slug);
}
