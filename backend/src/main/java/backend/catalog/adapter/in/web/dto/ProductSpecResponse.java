package backend.catalog.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductSpecResponse {
    private String label;
    private String value;
}
