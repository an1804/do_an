package backend.auth.application.service;

import backend.auth.application.model.AuthResult;
import backend.auth.application.port.in.command.LoginCommand;
import backend.auth.application.port.in.command.RegisterCustomerCommand;
import backend.auth.application.port.out.AuthAccountPort;
import backend.auth.application.port.out.AuthSecurityPort;
import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import backend.shared.exception.AuthException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthUseCaseServiceTest {

    private FakeAccountPort accountPort;
    private FakeSecurityPort securityPort;
    private AuthUseCaseService useCase;

    @BeforeEach
    void setUp() {
        accountPort = new FakeAccountPort();
        securityPort = new FakeSecurityPort();
        useCase = new AuthUseCaseService(accountPort, securityPort);
    }

    @Test
    void registerCreatesCustomerAccount() {
        AuthResult result = useCase.register(new RegisterCustomerCommand(
                "Nguyen Van A",
                "a@example.com",
                "0901234567",
                "secret1"
        ));

        assertEquals("CUSTOMER", result.role());
        assertEquals("a@example.com", result.email());
        assertEquals("Nguyen Van A", result.fullName());
    }

    @Test
    void registerRejectsDuplicateEmail() {
        useCase.register(new RegisterCustomerCommand("A", "a@example.com", "0901234567", "secret1"));

        AuthException ex = assertThrows(AuthException.class, () ->
                useCase.register(new RegisterCustomerCommand("B", "a@example.com", "0909999999", "secret1")));
        assertEquals("Email nay da duoc dang ky", ex.getMessage());
    }

    @Test
    void loginReturnsTokensForEnabledAccount() {
        useCase.register(new RegisterCustomerCommand("A", "a@example.com", "0901234567", "secret1"));

        AuthResult result = useCase.login(new LoginCommand("a@example.com", "secret1"));

        assertEquals("access-a@example.com", result.accessToken());
        assertEquals("refresh-a@example.com", result.refreshToken());
        assertEquals("CUSTOMER", result.role());
    }

    @Test
    void loginRejectsDisabledAccount() {
        accountPort.save(new Account(1L, "a@example.com", "hash", "A", Role.CUSTOMER, false));

        AuthException ex = assertThrows(AuthException.class, () ->
                useCase.login(new LoginCommand("a@example.com", "secret1")));
        assertEquals("Tai khoan da bi vo hieu hoa", ex.getMessage());
    }

    @Test
    void loginRejectsUnknownAccountAfterAuthenticate() {
        securityPort.failAuthenticate = true;
        assertThrows(BadCredentialsException.class, () ->
                useCase.login(new LoginCommand("missing@example.com", "secret1")));
    }

    private static final class FakeAccountPort implements AuthAccountPort {
        private final Map<String, Account> byEmail = new HashMap<>();
        private final Map<String, String> phones = new HashMap<>();
        private final AtomicLong ids = new AtomicLong(1);

        @Override
        public boolean existsByEmail(String email) {
            return byEmail.containsKey(email.toLowerCase());
        }

        @Override
        public boolean existsCustomerByPhone(String phone) {
            return phones.containsKey(phone);
        }

        @Override
        public Optional<Account> loadByEmail(String email) {
            return Optional.ofNullable(byEmail.get(email.toLowerCase()));
        }

        @Override
        public Account saveCustomer(Account account, String phone) {
            Account saved = save(account);
            phones.put(phone, saved.email());
            return saved;
        }

        @Override
        public Account saveAccount(Account account, Role role, String shopName) {
            return save(new Account(account.id(), account.email(), account.passwordHash(), account.fullName(), role, account.enabled()));
        }

        Account save(Account account) {
            Account saved = new Account(
                    account.id() == null ? ids.getAndIncrement() : account.id(),
                    account.email().toLowerCase(),
                    account.passwordHash(),
                    account.fullName(),
                    account.role(),
                    account.enabled()
            );
            byEmail.put(saved.email(), saved);
            return saved;
        }
    }

    private static final class FakeSecurityPort implements AuthSecurityPort {
        boolean failAuthenticate;

        @Override
        public void authenticate(String email, String password) {
            if (failAuthenticate) {
                throw new BadCredentialsException("bad");
            }
        }

        @Override
        public String encodePassword(String rawPassword) {
            return "encoded-" + rawPassword;
        }

        @Override
        public String generateAccessToken(Account account) {
            return "access-" + account.email();
        }

        @Override
        public String generateRefreshToken(Account account) {
            return "refresh-" + account.email();
        }

        @Override
        public String rotateRefreshToken(Account account, String currentRefreshToken) {
            return "rotated-" + account.email();
        }

        @Override
        public String extractUsername(String token) {
            return token.replace("refresh-", "");
        }

        @Override
        public boolean isRefreshTokenValid(String token, Account account) {
            return token.contains(account.email());
        }

        @Override
        public void revokeToken(String token) {
        }

        @Override
        public boolean isTokenRevoked(String token) {
            return false;
        }
    }
}
