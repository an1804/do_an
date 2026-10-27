package backend.shared.web;

import backend.shared.exception.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(ApiResponse.<Map<String, String>>builder()
                .success(false)
                .message("Du lieu khong hop le")
                .data(errors)
                .build());
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiResponse<String>> handleAuthException(AuthException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                .success(false)
                .message(ex.getMessage())
                .build());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<String>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.<String>builder()
                .success(false)
                .message("Email hoac mat khau khong chinh xac")
                .build());
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiResponse<String>> handleDataAccessException(
            DataAccessException ex,
            HttpServletRequest request
    ) {
        String method = request == null ? "" : request.getMethod();
        String message = "GET".equalsIgnoreCase(method)
                ? "Khong the tai du lieu. Vui long thu lai."
                : "Khong the luu du lieu. Vui long thu lai.";
        return ResponseEntity.internalServerError().body(ApiResponse.<String>builder()
                .success(false)
                .message(message)
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        return ResponseEntity.internalServerError().body(ApiResponse.<String>builder()
                .success(false)
                .message("Loi may chu. Vui long thu lai.")
                .build());
    }
}
