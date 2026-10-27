package backend.auth.application.port.in.command;

public record LoginCommand(String email, String password) {
}
