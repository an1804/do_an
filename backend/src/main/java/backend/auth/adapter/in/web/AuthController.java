package backend.auth.adapter.in.web;

import backend.auth.adapter.in.web.dto.AuthResponse;
import backend.auth.adapter.in.web.dto.LoginRequest;
import backend.auth.adapter.in.web.dto.RegisterRequest;
import backend.auth.application.model.AuthResult;
import backend.auth.application.model.SessionResult;
import backend.auth.application.port.in.GetSessionUseCase;
import backend.auth.application.port.in.LoginUseCase;
import backend.auth.application.port.in.LogoutUseCase;
import backend.auth.application.port.in.RefreshSessionUseCase;
import backend.auth.application.port.in.RegisterCustomerUseCase;
import backend.auth.application.port.in.command.LoginCommand;
import backend.auth.application.port.in.command.LogoutCommand;
import backend.auth.application.port.in.command.RefreshSessionCommand;
import backend.auth.application.port.in.command.RegisterCustomerCommand;
import backend.security.AuthCookieService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegisterCustomerUseCase registerCustomerUseCase;
    private final LoginUseCase loginUseCase;
    private final RefreshSessionUseCase refreshSessionUseCase;
    private final LogoutUseCase logoutUseCase;
    private final GetSessionUseCase getSessionUseCase;
    private final AuthCookieService authCookieService;

    public AuthController(
            RegisterCustomerUseCase registerCustomerUseCase,
            LoginUseCase loginUseCase,
            RefreshSessionUseCase refreshSessionUseCase,
            LogoutUseCase logoutUseCase,
            GetSessionUseCase getSessionUseCase,
            AuthCookieService authCookieService
    ) {
        this.registerCustomerUseCase = registerCustomerUseCase;
        this.loginUseCase = loginUseCase;
        this.refreshSessionUseCase = refreshSessionUseCase;
        this.logoutUseCase = logoutUseCase;
        this.getSessionUseCase = getSessionUseCase;
        this.authCookieService = authCookieService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        AuthResult result = registerCustomerUseCase.register(new RegisterCustomerCommand(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword()
        ));
        return ResponseEntity.status(HttpStatus.CREATED).body(AuthWebMapper.toResponse(result));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = AuthWebMapper.toResponse(loginUseCase.login(new LoginCommand(
                request.getEmail(),
                request.getPassword()
        )));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookieService.accessCookie(response.getAccessToken()).toString())
                .header(HttpHeaders.SET_COOKIE, authCookieService.refreshCookie(response.getRefreshToken()).toString())
                .body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(value = AuthCookieService.REFRESH_COOKIE_NAME, required = false) String refreshToken
    ) {
        AuthResponse response = AuthWebMapper.toResponse(
                refreshSessionUseCase.refresh(new RefreshSessionCommand(refreshToken))
        );
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookieService.accessCookie(response.getAccessToken()).toString())
                .header(HttpHeaders.SET_COOKIE, authCookieService.refreshCookie(response.getRefreshToken()).toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @CookieValue(value = AuthCookieService.ACCESS_COOKIE_NAME, required = false) String accessToken,
            @CookieValue(value = AuthCookieService.REFRESH_COOKIE_NAME, required = false) String refreshToken
    ) {
        logoutUseCase.logout(new LogoutCommand(accessToken, refreshToken));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookieService.clearAccessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, authCookieService.clearRefreshCookie().toString())
                .body(Map.of("message", "Dang xuat thanh cong"));
    }

    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> session(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Phien dang nhap khong hop le"));
        }
        SessionResult session = getSessionUseCase.getSession(authentication.getName());
        return ResponseEntity.ok(Map.of(
                "role", session.role(),
                "email", session.email(),
                "fullName", session.fullName()
        ));
    }
}
