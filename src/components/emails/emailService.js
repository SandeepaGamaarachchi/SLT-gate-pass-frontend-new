
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify required variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Email credentials not configured in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false // For development only
  }
});

// Test connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Connection Ready');
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Item Transfer System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, // Send both text and HTML versions
    });
    
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};