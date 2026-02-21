const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(to, resetUrl) {
  await resend.emails.send({
    from: "GetLa <onboarding@resend.dev>",
    to,
    subject: "Recuperación de contraseña - GetLa",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Recuperación de contraseña</h2>
        <p>Haz clic en el siguiente enlace (válido por 1 hora):</p>
        <p>
          <a href="${resetUrl}">
            Restablecer contraseña
          </a>
        </p>
        <p>Si tú no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
}

module.exports = { sendResetEmail };