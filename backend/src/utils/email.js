const nodemailer = require('nodemailer');

// Transporter opzetten (gebruik je eigen e-mailadres!)
const transporter = nodemailer.createTransport({
  service: 'gmail', // gebruik bijv. Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendReminderEmail = async (toEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Medicatie App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log('✅ Email verzonden naar', toEmail);
  } catch (err) {
    console.error('❌ Email verzenden mislukt:', err);
  }
};
