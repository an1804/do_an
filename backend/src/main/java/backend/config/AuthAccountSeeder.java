package backend.config;

import backend.auth.application.port.out.AuthAccountPort;
import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class AuthAccountSeeder implements CommandLineRunner {

    private final AuthAccountPort authAccountPort;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String sellerEmail;
    private final String sellerPassword;

    public AuthAccountSeeder(
            AuthAccountPort authAccountPort,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.admin-email}") String adminEmail,
            @Value("${app.seed.admin-password}") String adminPassword,
            @Value("${app.seed.seller-email}") String sellerEmail,
            @Value("${app.seed.seller-password}") String sellerPassword
    ) {
        this.authAccountPort = authAccountPort;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.sellerEmail = sellerEmail;
        this.sellerPassword = sellerPassword;
    }

    @Override
    public void run(String... args) {
        seed(adminEmail, adminPassword, "TechStore Admin", Role.ADMIN, null);
        seed(sellerEmail, sellerPassword, "TechStore Seller", Role.SELLER, "TechStore Official");
    }

    private void seed(String email, String password, String fullName, Role role, String shopName) {
        if (authAccountPort.existsByEmail(email)) {
            return;
        }
        Account account = new Account(null, email.toLowerCase(), passwordEncoder.encode(password), fullName, role, true);
        authAccountPort.saveAccount(account, role, shopName);
    }
}
