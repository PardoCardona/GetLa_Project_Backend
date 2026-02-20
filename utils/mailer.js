const nodemailer = require("nodemailer");

function createTransporter() {

    console.log("USER:", process.env.SMTP_USER);
console.log("PASS LENGTH:", process.env.SMTP_PASS?.length);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true si 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendResetEmail(to, resetUrl) {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"GetLa" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recuperación de contraseña - GetLa",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace (válido por 1 hora):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Si tú no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendResetEmail };
