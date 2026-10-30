package backend.auth.application.service;

import backend.auth.application.model.AuthResult;
import backend.auth.application.model.RegisterOtpChallenge;
import backend.auth.application.model.RegisterOtpResult;
import backend.auth.application.model.SessionResult;
import backend.auth.application.port.in.GetSessionUseCase;
import backend.auth.application.port.in.LoginUseCase;
import backend.auth.application.port.in.LogoutUseCase;
import backend.auth.application.port.in.RefreshSessionUseCase;
import backend.auth.application.port.in.RequestRegisterOtpUseCase;
import backend.auth.application.port.in.ResendRegisterOtpUseCase;
import backend.auth.application.port.in.VerifyRegisterOtpUseCase;
import backend.auth.application.port.in.command.LoginCommand;
import backend.auth.application.port.in.command.LogoutCommand;
import backend.auth.application.port.in.command.RefreshSessionCommand;
import backend.auth.application.port.in.command.RegisterCustomerCommand;
import backend.auth.application.port.in.command.VerifyRegisterOtpCommand;
import backend.auth.application.port.out.AuthAccountPort;
import backend.auth.application.port.out.AuthMailPort;
import backend.auth.application.port.out.AuthSecurityPort;
import backend.auth.application.port.out.RegisterOtpPort;
import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import backend.shared.exception.AuthException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@Service
@Transactional(readOnly = true)
public class AuthUseCaseService implements
        RequestRegisterOtpUseCase,
        VerifyRegisterOtpUseCase,
        ResendRegisterOtpUseCase,
        LoginUseCase,
        RefreshSessionUseCase,
        LogoutUseCase,
        GetSessionUseCase {

    static final int OTP_TTL_SECONDS = 120;
    static final int OTP_RESEND_SECONDS = 60;
    static final int OTP_MAX_ATTEMPTS = 5;

    private final AuthAccountPort authAccountPort;
    private final AuthSecurityPort authSecurityPort;
    private final RegisterOtpPort registerOtpPort;
    private final AuthMailPort authMailPort;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthUseCaseService(
            AuthAccountPort authAccountPort,
            AuthSecurityPort authSecurityPort,
            RegisterOtpPort registerOtpPort,
            AuthMailPort authMailPort
    ) {
        this.authAccountPort = authAccountPort;
        this.authSecurityPort = authSecurityPort;
        this.registerOtpPort = registerOtpPort;
        this.authMailPort = authMailPort;
    }

    @Override
    @Transactional
    public RegisterOtpResult requestOtp(RegisterCustomerCommand command) {
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
        registerOtpPort.findByPhone(phone)
                .filter(existing -> !existing.email().equalsIgnoreCase(email))
                .ifPresent(existing -> {
                    throw new AuthException("So dien thoai nay dang cho xac nhan");
                });

        Instant now = Instant.now();
        registerOtpPort.findByEmail(email).ifPresent(existing -> {
            if (Duration.between(existing.sentAt(), now).getSeconds() < OTP_RESEND_SECONDS) {
                throw new AuthException("Vui long doi truoc khi gui lai ma");
            }
        });

        String code = generateOtp();
        RegisterOtpChallenge challenge = new RegisterOtpChallenge(
                email,
                phone,
                fullName,
                authSecurityPort.encodePassword(password),
                authSecurityPort.encodePassword(code),
                now.plusSeconds(OTP_TTL_SECONDS),
                now,
                0
        );
        persistAndSend(challenge, code, fullName);
        return new RegisterOtpResult(email, OTP_TTL_SECONDS);
    }

    @Override
    @Transactional
    public RegisterOtpResult resendOtp(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        RegisterOtpChallenge existing = registerOtpPort.findByEmail(email)
                .orElseThrow(() -> new AuthException("Khong tim thay yeu cau dang ky. Hay dien lai form."));
        Instant now = Instant.now();
        if (Duration.between(existing.sentAt(), now).getSeconds() < OTP_RESEND_SECONDS) {
            throw new AuthException("Vui long doi truoc khi gui lai ma");
        }
        if (authAccountPort.existsByEmail(email)) {
            registerOtpPort.deleteByEmail(email);
            throw new AuthException("Email nay da duoc dang ky");
        }

        String code = generateOtp();
        RegisterOtpChallenge next = existing.withCode(
                authSecurityPort.encodePassword(code),
                now.plusSeconds(OTP_TTL_SECONDS),
                now
        );
        persistAndSend(next, code, existing.fullName());
        return new RegisterOtpResult(email, OTP_TTL_SECONDS);
    }

    @Override
    @Transactional
    public AuthResult verifyOtp(VerifyRegisterOtpCommand command) {
        String email = normalizeEmail(command.email());
        String code = required(command.code(), "Ma xac nhan khong duoc de trong");
        RegisterOtpChallenge challenge = registerOtpPort.findByEmail(email)
                .orElseThrow(() -> new AuthException("Ma xac nhan khong hop le hoac da het han"));
        Instant now = Instant.now();
        if (now.isAfter(challenge.expiresAt())) {
            registerOtpPort.deleteByEmail(email);
            throw new AuthException("Ma xac nhan khong hop le hoac da het han");
        }
        if (challenge.attemptCount() >= OTP_MAX_ATTEMPTS) {
            throw new AuthException("Ma xac nhan da het luot thu. Hay gui lai ma");
        }
        if (!authSecurityPort.matchesPassword(code, challenge.codeHash())) {
            registerOtpPort.save(challenge.withAttemptCount(challenge.attemptCount() + 1));
            throw new AuthException("Ma xac nhan khong dung");
        }
        if (authAccountPort.existsByEmail(email)) {
            registerOtpPort.deleteByEmail(email);
            throw new AuthException("Email nay da duoc dang ky");
        }
        if (authAccountPort.existsCustomerByPhone(challenge.phone())) {
            registerOtpPort.deleteByEmail(email);
            throw new AuthException("So dien thoai nay da duoc dang ky");
        }

        Account account = new Account(
                null,
                challenge.email(),
                challenge.passwordHash(),
                challenge.fullName(),
                Role.CUSTOMER,
                true
        );
        Account saved = authAccountPort.saveCustomer(account, challenge.phone());
        registerOtpPort.deleteByEmail(email);
        return tokens(saved);
    }

    @Override
    public AuthResult login(LoginCommand command) {
        String identifier = required(command.email(), "Email hoac so dien thoai khong duoc de trong");
        String password = required(command.password(), "Mat khau khong duoc de trong");
        String email = resolveLoginEmail(identifier);
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
        return tokens(account, accessToken, newRefreshToken);
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
        return new SessionResult(account.role().name(), account.email(), account.fullName(), customerPhone(account.email()));
    }

    private void persistAndSend(RegisterOtpChallenge challenge, String code, String fullName) {
        registerOtpPort.save(challenge);
        try {
            authMailPort.sendRegisterOtp(challenge.email(), fullName, code);
        } catch (AuthException ex) {
            registerOtpPort.deleteByEmail(challenge.email());
            throw ex;
        } catch (RuntimeException ex) {
            registerOtpPort.deleteByEmail(challenge.email());
            throw new AuthException("Khong gui duoc email xac nhan. Vui long thu lai.");
        }
    }

    private String generateOtp() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    private AuthResult tokens(Account account) {
        return tokens(
                account,
                authSecurityPort.generateAccessToken(account),
                authSecurityPort.generateRefreshToken(account)
        );
    }

    private AuthResult tokens(Account account, String accessToken, String refreshToken) {
        return new AuthResult(
                accessToken,
                refreshToken,
                account.role().name(),
                account.email(),
                account.fullName(),
                customerPhone(account.email())
        );
    }

    private String customerPhone(String email) {
        return authAccountPort.findCustomerPhoneByEmail(email).orElse(null);
    }

    private String resolveLoginEmail(String identifier) {
        String value = identifier.trim();
        if (value.contains("@")) {
            return value.toLowerCase();
        }
        return authAccountPort.loadByCustomerPhone(value)
                .map(Account::email)
                .orElseThrow(() -> new BadCredentialsException("Email hoac mat khau khong chinh xac"));
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
