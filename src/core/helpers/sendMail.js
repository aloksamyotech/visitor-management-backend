import nodemailer from 'nodemailer'
import process from 'node:process'

export const sendMail = async (mail, html) => {
  const email = process.env.EMAIL
  const pass = process.env.EMAIL_KEY
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: email,
        pass: pass,
      },
    })

    const mailOptions = {
      from: email,
      to: mail,
      subject: 'Samyotech Solution Pvt. Ltd.',
      // text: `Hello, mail received`,
      html,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
