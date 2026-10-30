package backend.auth.application.port.out;

import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;

import java.util.Optional;

public interface AuthAccountPort {
    boolean existsByEmail(String email);

    boolean existsCustomerByPhone(String phone);

    Optional<Account> loadByEmail(String email);

    Optional<Account> loadByCustomerPhone(String phone);

    Optional<String> findCustomerPhoneByEmail(String email);

    Account saveCustomer(Account account, String phone);

    Account saveAccount(Account account, Role role, String shopName);
}
