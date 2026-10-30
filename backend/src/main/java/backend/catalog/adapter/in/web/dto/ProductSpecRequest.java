package backend.catalog.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSpecRequest {

    @NotBlank(message = "Ten thong so khong duoc de trong")
    private String label;

    @NotBlank(message = "Gia tri thong so khong duoc de trong")
    private String value;
}
