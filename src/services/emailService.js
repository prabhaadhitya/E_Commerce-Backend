const transporter = require('../config/nodemailer');

const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  if (!to) throw new Error('Recipient (to) is required');
  if (!subject) subject = '(no subject)';

  const mailOptions = {
    from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
  };

  const info = await transporter.sendMail(mailOptions);
  
  return info;
};

module.exports = { sendEmail };
