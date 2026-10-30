package backend.catalog.application.port.in;

import backend.catalog.application.port.in.command.UpdateProductCommand;
import backend.catalog.domain.model.Product;

public interface UpdateProductUseCase {
    Product update(UpdateProductCommand command);
}
