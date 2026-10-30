package backend.catalog.application.port.in;

import backend.catalog.domain.model.Product;

import java.util.List;

public interface ListSellerProductsUseCase {
    List<Product> listMine(String sellerEmail);
}
