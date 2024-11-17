const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Your full Gmail address
      pass: process.env.EMAILPASSWORD, // App Password, not regular password
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="http://localhost:3000/verify/${token}">Verify Email</a>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", info);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
