package backend.auth.application.service;

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
import backend.auth.application.port.out.AuthAccountPort;
import backend.auth.application.port.out.AuthSecurityPort;
import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import backend.shared.exception.AuthException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthUseCaseService implements
        RegisterCustomerUseCase,
        LoginUseCase,
        RefreshSessionUseCase,
        LogoutUseCase,
        GetSessionUseCase {

    private final AuthAccountPort authAccountPort;
    private final AuthSecurityPort authSecurityPort;

    public AuthUseCaseService(AuthAccountPort authAccountPort, AuthSecurityPort authSecurityPort) {
        this.authAccountPort = authAccountPort;
        this.authSecurityPort = authSecurityPort;
    }

    @Override
    @Transactional
    public AuthResult register(RegisterCustomerCommand command) {
        String fullName = required(command.fullName(), "Ho ten khong duoc de trong");
        String email = normalizeEmail(command.email());
        String phone = required(command.phone(), "So dien thoai khong duoc de trong");
        String password = required(command.password(), "Mat khau khong duoc de trong");
        if (password.length() < 6) {
            throw new AuthException("Mat khau phai co it nhat 6 ky tu");
        }
        if (authAccountPort.existsByEmail(email)) {
            throw new AuthException("Email nay da duoc dang ky");
        }
        if (authAccountPort.existsCustomerByPhone(phone)) {
            throw new AuthException("So dien thoai nay da duoc dang ky");
        }

        Account account = new Account(
                null,
                email,
                authSecurityPort.encodePassword(password),
                fullName,
                Role.CUSTOMER,
                true
        );
        Account saved = authAccountPort.saveCustomer(account, phone);
        return new AuthResult(null, null, saved.role().name(), saved.email(), saved.fullName());
    }

    @Override
    public AuthResult login(LoginCommand command) {
        String email = normalizeEmail(command.email());
        String password = required(command.password(), "Mat khau khong duoc de trong");
        authSecurityPort.authenticate(email, password);

        Account account = authAccountPort.loadByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email hoac mat khau khong chinh xac"));
        if (!account.enabled()) {
            throw new AuthException("Tai khoan da bi vo hieu hoa");
        }
        return tokens(account);
    }

    @Override
    @Transactional
    public AuthResult refresh(RefreshSessionCommand command) {
        String refreshToken = required(command.refreshToken(), "Khong tim thay refresh token");
        if (authSecurityPort.isTokenRevoked(refreshToken)) {
            throw new BadCredentialsException("Refresh token da bi thu hoi");
        }

        String email;
        try {
            email = authSecurityPort.extractUsername(refreshToken);
        } catch (RuntimeException ex) {
            throw new BadCredentialsException("Refresh token khong hop le", ex);
        }

        Account account = authAccountPort.loadByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Tai khoan khong con ton tai"));
        if (!account.enabled() || !authSecurityPort.isRefreshTokenValid(refreshToken, account)) {
            throw new BadCredentialsException("Refresh token khong hop le hoac da het han");
        }

        String accessToken = authSecurityPort.generateAccessToken(account);
        String newRefreshToken;
        try {
            newRefreshToken = authSecurityPort.rotateRefreshToken(account, refreshToken);
        } catch (RuntimeException ex) {
            throw new BadCredentialsException("Phien dang nhap da het han", ex);
        }
        authSecurityPort.revokeToken(refreshToken);
        return new AuthResult(accessToken, newRefreshToken, account.role().name(), account.email(), account.fullName());
    }

    @Override
    public void logout(LogoutCommand command) {
        authSecurityPort.revokeToken(command.accessToken());
        authSecurityPort.revokeToken(command.refreshToken());
    }

    @Override
    public SessionResult getSession(String email) {
        Account account = authAccountPort.loadByEmail(normalizeEmail(email))
                .orElseThrow(() -> new AuthException("Phien dang nhap khong hop le"));
        return new SessionResult(account.role().name(), account.email(), account.fullName());
    }

    private AuthResult tokens(Account account) {
        return new AuthResult(
                authSecurityPort.generateAccessToken(account),
                authSecurityPort.generateRefreshToken(account),
                account.role().name(),
                account.email(),
                account.fullName()
        );
    }

    private String normalizeEmail(String email) {
        String value = required(email, "Email khong duoc de trong").toLowerCase();
        if (!value.contains("@")) {
            throw new AuthException("Email khong hop le");
        }
        return value;
    }

    private String required(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new AuthException(message);
        }
        return value.trim();
    }
}
