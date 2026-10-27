package backend.auth.application.port.in.command;

public record RegisterCustomerCommand(
        String fullName,
        String email,
        String phone,
        String password
) {
}
