package backend.catalog.application.port.in;

import backend.catalog.application.port.in.command.CreateProductCommand;
import backend.catalog.domain.model.Product;

public interface CreateProductUseCase {
    Product create(CreateProductCommand command);
}
