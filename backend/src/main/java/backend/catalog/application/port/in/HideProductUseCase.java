package backend.catalog.application.port.in;

public interface HideProductUseCase {
    void hide(String sellerEmail, Long productId);
}
