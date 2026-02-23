const { Resend } = require("resend");


const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(to, resetUrl) {
  const response = await resend.emails.send({
  from: "onboarding@resend.dev",
  to,
  subject: "Recuperación de contraseña - GetLa",
  html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="color: #2c3e50;">Recuperación de contraseña</h2>

    <p>Hola,</p>

    <p>
      Hemos recibido una solicitud para restablecer tu contraseña en <strong>GetLa</strong>.
    </p>

    <p>
      Para continuar con el proceso, haz clic en el siguiente botón:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a 
        href="${resetUrl}" 
        style="
          background-color: #4f46e5;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          display: inline-block;
        "
      >
        Restablecer contraseña
      </a>
    </div>

    <p>
      Este enlace es válido por 1 hora.
    </p>

    <p>
      Si tú no solicitaste este cambio, puedes ignorar este mensaje.
    </p>

    <hr style="margin: 30px 0;" />

    <p style="font-size: 12px; color: gray;">
      Equipo GetLa
    </p>
  </div>
`,
});


}

module.exports = { sendResetEmail };