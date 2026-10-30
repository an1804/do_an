package backend.auth.adapter.out.mail;

import backend.auth.application.port.out.AuthMailPort;
import backend.shared.exception.AuthException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class AuthMailAdapter implements AuthMailPort {

    private static final Logger log = LoggerFactory.getLogger(AuthMailAdapter.class);

    private final JavaMailSender mailSender;
    private final String username;
    private final String from;

    public AuthMailAdapter(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String username,
            @Value("${app.mail.from:}") String from
    ) {
        this.mailSender = mailSender;
        this.username = username;
        this.from = from;
    }

    @Override
    public void sendRegisterOtp(String toEmail, String fullName, String code) {
        if (!StringUtils.hasText(username)) {
            throw new AuthException("Chua cau hinh email. Dat MAIL_USERNAME va MAIL_PASSWORD.");
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(StringUtils.hasText(from) ? from : username);
            helper.setTo(toEmail);
            helper.setSubject("Mã xác nhận đăng ký thegioicongnghe");
            helper.setText(
                    "Xin chào " + fullName + ",\n\n"
                            + "Mã xác nhận đăng ký tài khoản thegioicongnghe của bạn là: " + code + "\n"
                            + "Mã có hiệu lực trong 2 phút.\n\n"
                            + "Nếu bạn không đăng ký, hãy bỏ qua email này.\n",
                    false
            );
            mailSender.send(message);
        } catch (AuthException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to send register OTP to {}", toEmail, ex);
            throw new AuthException("Khong gui duoc email xac nhan. Vui long thu lai.");
        }
    }
}
