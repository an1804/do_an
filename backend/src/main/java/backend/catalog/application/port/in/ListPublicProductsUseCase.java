package backend.catalog.application.port.in;

import backend.catalog.domain.model.Product;

import java.util.List;

public interface ListPublicProductsUseCase {
    List<Product> listPublic(String category, String query);
}
