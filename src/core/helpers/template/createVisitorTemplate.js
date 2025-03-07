import { sendMail } from '../sendMail.js'

export const createVisitorTemplate = (details) => {
  const html = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #4CAF50;">Visitor Registration Successful</h2>
        <p>Dear <strong>${details?.firstName}</strong>,</p>
        <p>We look forward to welcoming you!</p>
        <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
      </div>`

  sendMail(details?.emailAddress, html)
}
