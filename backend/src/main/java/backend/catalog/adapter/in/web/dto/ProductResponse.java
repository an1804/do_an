package backend.catalog.adapter.in.web.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductResponse {
    private String id;
    private String slug;
    private String name;
    private String category;
    private long price;
    private Long originalPrice;
    private String image;
    private String shortDescription;
    private String status;
    private List<ProductSpecResponse> specs;
}
