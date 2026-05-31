package br.edu.utfpr.pb.pw44s.server.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderStatusUpdate(String toEmail, String customerName,
                                      Long orderId, String previousStatus,
                                      String newStatus) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(toEmail);
            helper.setSubject("Pedido #" + orderId + " - Status atualizado: " + newStatus);
            helper.setText(buildEmailBody(customerName, orderId, previousStatus, newStatus), true);

            mailSender.send(message);
            log.info("E-mail enviado para {} - Pedido #{} status: {}", toEmail, orderId, newStatus);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail para {} - Pedido #{}: {}", toEmail, orderId, e.getMessage());
        }
    }

    private String buildEmailBody(String name, Long orderId,
                                  String previous, String newStatus) {
        return """
        <html>
        <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.10);">

                  <!-- Header azul com logo -->
                  <tr>
                    <td style="background-color:#0033a0;padding:28px 40px;text-align:center;">
                      <h1 style="color:#ff6a00;margin:0;font-size:28px;font-weight:900;letter-spacing:2px;font-style:italic;">KATCHAU!</h1>
                      <p style="color:#ffffff;margin:6px 0 0;font-size:13px;letter-spacing:1px;">ATUALIZAÇÃO DO SEU PEDIDO</p>
                    </td>
                  </tr>

                  <!-- Faixa laranja -->
                  <tr>
                    <td style="background-color:#ff6a00;padding:10px 40px;">
                      <p style="margin:0;color:#ffffff;font-size:13px;font-weight:bold;letter-spacing:0.5px;">
                        📦 Pedido <strong>#%d</strong> — status atualizado
                      </p>
                    </td>
                  </tr>

                  <!-- Saudação -->
                  <tr>
                    <td style="padding:32px 40px 16px;">
                      <p style="font-size:16px;color:#1a1a1a;margin:0;">Olá, <strong>%s</strong>! 👋</p>
                      <p style="font-size:15px;color:#555555;margin:10px 0 0;">
                        Seu pedido teve uma atualização. Confira abaixo o que mudou:
                      </p>
                    </td>
                  </tr>

                  <!-- Cards de status -->
                  <tr>
                    <td style="padding:8px 40px 24px;">
                      <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <!-- Status anterior -->
                          <td width="48%%" style="background-color:#fff3f3;border:1px solid #ffcccc;border-radius:8px;padding:18px;text-align:center;">
                            <p style="margin:0;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.5px;">Status anterior</p>
                            <p style="margin:8px 0 0;font-size:14px;color:#cc0000;font-weight:bold;">%s</p>
                          </td>
                          <!-- Seta -->
                          <td width="4%%" style="text-align:center;font-size:20px;color:#0033a0;">→</td>
                          <!-- Novo status -->
                          <td width="48%%" style="background-color:#f0fff4;border:1px solid #b3eac4;border-radius:8px;padding:18px;text-align:center;">
                            <p style="margin:0;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.5px;">Novo status</p>
                            <p style="margin:8px 0 0;font-size:14px;color:#1a7a3c;font-weight:bold;">%s</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Mensagem de apoio -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <p style="font-size:13px;color:#888888;margin:0;line-height:1.6;">
                        Ficou com dúvidas? Acesse sua conta no site ou entre em contato com nosso suporte.
                        Estamos sempre prontos para ajudar! 🚀
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#0033a0;padding:20px 40px;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#aabbdd;">
                        © 2026 <span style="color:#ff6a00;font-weight:bold;">KATCHAU!</span> · Todos os direitos reservados
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """.formatted(orderId, name, previous, newStatus);
    }
}