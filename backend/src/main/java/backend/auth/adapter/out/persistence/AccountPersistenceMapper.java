package backend.auth.adapter.out.persistence;

import backend.auth.adapter.out.persistence.entity.AccountEntity;
import backend.auth.domain.model.Account;

final class AccountPersistenceMapper {

    private AccountPersistenceMapper() {
    }

    static Account toDomain(AccountEntity entity) {
        return new Account(
                entity.getId(),
                entity.getEmail(),
                entity.getPasswordHash(),
                entity.getFullName(),
                entity.getRole(),
                entity.isEnabled()
        );
    }

    static AccountEntity toNewEntity(Account account) {
        AccountEntity entity = new AccountEntity();
        entity.setEmail(account.email());
        entity.setPasswordHash(account.passwordHash());
        entity.setFullName(account.fullName());
        entity.setRole(account.role());
        entity.setEnabled(account.enabled());
        return entity;
    }
}
