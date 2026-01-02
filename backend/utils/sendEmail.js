const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create the Transporter (The Mailman)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // We will check your .env for this
      pass: process.env.EMAIL_PASS, // We will check your .env for this
    },
  });

  // 2. Define the Email Options
  const mailOptions = {
    from: `"YouTool Support" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text, // We send HTML for nice looking emails
  };

  // 3. Send the Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;