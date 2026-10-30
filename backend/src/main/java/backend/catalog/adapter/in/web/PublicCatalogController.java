package backend.catalog.adapter.in.web;

import backend.catalog.adapter.in.web.dto.CategoryResponse;
import backend.catalog.adapter.in.web.dto.ProductResponse;
import backend.catalog.application.port.in.GetPublicProductUseCase;
import backend.catalog.application.port.in.ListCategoriesUseCase;
import backend.catalog.application.port.in.ListPublicProductsUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PublicCatalogController {

    private final ListPublicProductsUseCase listPublicProductsUseCase;
    private final GetPublicProductUseCase getPublicProductUseCase;
    private final ListCategoriesUseCase listCategoriesUseCase;

    public PublicCatalogController(
            ListPublicProductsUseCase listPublicProductsUseCase,
            GetPublicProductUseCase getPublicProductUseCase,
            ListCategoriesUseCase listCategoriesUseCase
    ) {
        this.listPublicProductsUseCase = listPublicProductsUseCase;
        this.getPublicProductUseCase = getPublicProductUseCase;
        this.listCategoriesUseCase = listCategoriesUseCase;
    }

    @GetMapping("/api/categories")
    public List<CategoryResponse> categories() {
        return listCategoriesUseCase.listCategories().stream()
                .map(CatalogWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/api/products")
    public List<ProductResponse> products(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q
    ) {
        return listPublicProductsUseCase.listPublic(category, q).stream()
                .map(CatalogWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/api/products/{slug}")
    public ProductResponse product(@PathVariable String slug) {
        return CatalogWebMapper.toResponse(getPublicProductUseCase.getPublicBySlug(slug));
    }
}
