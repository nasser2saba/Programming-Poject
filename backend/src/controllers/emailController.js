const nodemailer = require('nodemailer');

exports.sendEmailReminder = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Medicatie Herinnering',
    text: 'Vergeet niet om je medicatie in te nemen.'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};