package backend.catalog.adapter.in.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UpsertProductRequest {

    @NotBlank(message = "Slug khong duoc de trong")
    private String slug;

    @NotBlank(message = "Ten san pham khong duoc de trong")
    private String name;

    @NotBlank(message = "Danh muc khong duoc de trong")
    private String category;

    @NotNull(message = "Gia san pham khong hop le")
    @Positive(message = "Gia san pham khong hop le")
    private Long price;

    private Long originalPrice;

    @NotBlank(message = "Anh san pham khong duoc de trong")
    private String image;

    @NotBlank(message = "Mo ta ngan khong duoc de trong")
    private String shortDescription;

    @Valid
    private List<ProductSpecRequest> specs = new ArrayList<>();
}
