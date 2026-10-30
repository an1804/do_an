package backend.catalog.adapter.in.web;

import backend.catalog.adapter.in.web.dto.ProductResponse;
import backend.catalog.adapter.in.web.dto.UpsertProductRequest;
import backend.catalog.application.port.in.CreateProductUseCase;
import backend.catalog.application.port.in.HideProductUseCase;
import backend.catalog.application.port.in.ListSellerProductsUseCase;
import backend.catalog.application.port.in.UpdateProductUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products")
public class SellerCatalogController {

    private final ListSellerProductsUseCase listSellerProductsUseCase;
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final HideProductUseCase hideProductUseCase;

    public SellerCatalogController(
            ListSellerProductsUseCase listSellerProductsUseCase,
            CreateProductUseCase createProductUseCase,
            UpdateProductUseCase updateProductUseCase,
            HideProductUseCase hideProductUseCase
    ) {
        this.listSellerProductsUseCase = listSellerProductsUseCase;
        this.createProductUseCase = createProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.hideProductUseCase = hideProductUseCase;
    }

    @GetMapping
    public List<ProductResponse> mine(Authentication authentication) {
        return listSellerProductsUseCase.listMine(authentication.getName()).stream()
                .map(CatalogWebMapper::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(
            Authentication authentication,
            @RequestBody @Valid UpsertProductRequest request
    ) {
        return CatalogWebMapper.toResponse(
                createProductUseCase.create(CatalogWebMapper.toCreateCommand(authentication.getName(), request))
        );
    }

    @PutMapping("/{id}")
    public ProductResponse update(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody @Valid UpsertProductRequest request
    ) {
        return CatalogWebMapper.toResponse(
                updateProductUseCase.update(CatalogWebMapper.toUpdateCommand(authentication.getName(), id, request))
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void hide(Authentication authentication, @PathVariable Long id) {
        hideProductUseCase.hide(authentication.getName(), id);
    }
}
