const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const host = process.env.EMAIL_SMTP_HOST;
const port = Number(process.env.EMAIL_SMTP_PORT || 587);
const secure = process.env.EMAIL_SMTP_SECURE === 'true';
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!host || !user || !pass) {
  console.log('Nodemailer SMTP config incomplete. Email sending will be disabled.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass
  }
});

module.exports = transporter;
