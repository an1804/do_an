package backend.auth.adapter.out.persistence;

import backend.auth.adapter.out.persistence.entity.AccountEntity;
import backend.auth.adapter.out.persistence.entity.CustomerEntity;
import backend.auth.adapter.out.persistence.entity.SellerEntity;
import backend.auth.adapter.out.persistence.repository.AccountJpaRepository;
import backend.auth.adapter.out.persistence.repository.CustomerJpaRepository;
import backend.auth.adapter.out.persistence.repository.SellerJpaRepository;
import backend.auth.application.port.out.AuthAccountPort;
import backend.auth.domain.model.Account;
import backend.auth.domain.model.Role;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthPersistenceAdapter implements AuthAccountPort {

    private final AccountJpaRepository accountJpaRepository;
    private final CustomerJpaRepository customerJpaRepository;
    private final SellerJpaRepository sellerJpaRepository;

    public AuthPersistenceAdapter(
            AccountJpaRepository accountJpaRepository,
            CustomerJpaRepository customerJpaRepository,
            SellerJpaRepository sellerJpaRepository
    ) {
        this.accountJpaRepository = accountJpaRepository;
        this.customerJpaRepository = customerJpaRepository;
        this.sellerJpaRepository = sellerJpaRepository;
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountJpaRepository.existsByEmailIgnoreCase(email);
    }

    @Override
    public boolean existsCustomerByPhone(String phone) {
        return customerJpaRepository.existsByPhone(phone);
    }

    @Override
    public Optional<Account> loadByEmail(String email) {
        return accountJpaRepository.findByEmailIgnoreCase(email).map(AccountPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Account> loadByCustomerPhone(String phone) {
        return customerJpaRepository.findByPhoneWithAccount(phone).map(customer -> AccountPersistenceMapper.toDomain(customer.getAccount()));
    }

    @Override
    public Optional<String> findCustomerPhoneByEmail(String email) {
        return customerJpaRepository.findByAccount_EmailIgnoreCase(email).map(CustomerEntity::getPhone);
    }

    @Override
    public Account saveCustomer(Account account, String phone) {
        AccountEntity saved = accountJpaRepository.save(AccountPersistenceMapper.toNewEntity(account));
        CustomerEntity customer = new CustomerEntity();
        customer.setAccount(saved);
        customer.setPhone(phone);
        customerJpaRepository.save(customer);
        return AccountPersistenceMapper.toDomain(saved);
    }

    @Override
    public Account saveAccount(Account account, Role role, String shopName) {
        AccountEntity entity = AccountPersistenceMapper.toNewEntity(account);
        entity.setRole(role);
        AccountEntity saved = accountJpaRepository.save(entity);
        if (role == Role.SELLER) {
            SellerEntity seller = new SellerEntity();
            seller.setAccount(saved);
            seller.setShopName(shopName == null || shopName.isBlank() ? "TechStore Shop" : shopName);
            sellerJpaRepository.save(seller);
        }
        return AccountPersistenceMapper.toDomain(saved);
    }
}
