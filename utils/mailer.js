const { Resend } = require("resend");

console.log("RESEND KEY:", process.env.RESEND_API_KEY); // 👈 PONLO AQUÍ

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(to, resetUrl) {
  const response = await resend.emails.send({
  from: "onboarding@resend.dev",
  to,
  subject: "Recuperación de contraseña - GetLa",
  html: `
    <h2>Recuperación de contraseña</h2>
    <a href="${resetUrl}">Restablecer contraseña</a>
  `,
});

console.log("RESEND RESPONSE:", response);
}

module.exports = { sendResetEmail };