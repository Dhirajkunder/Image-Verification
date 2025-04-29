const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: Kunderdhiraj.com,
        pass: Dhiraj123,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
