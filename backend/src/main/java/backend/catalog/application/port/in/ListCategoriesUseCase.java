package backend.catalog.application.port.in;

import backend.catalog.domain.model.Category;

import java.util.List;

public interface ListCategoriesUseCase {
    List<Category> listCategories();
}
