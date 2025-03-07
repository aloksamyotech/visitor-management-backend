import { sendMail } from '../sendMail.js'

export const createCompanyTemplate = (details) => {
  const html = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
      <h2 style="color: #4CAF50;">Company Registration Successful</h2>
      <p>Dear Sir/Madam,</p>
      <p>We are pleased to inform you that your company <strong>${details?.firstName}</strong> has been successfully registered in our system on <strong>${new Date().toLocaleString()}</strong>.</p>
      <p>You can now manage your company’s visitors, appointments, and other details through our platform.</p>
      <p>If you have any questions or need assistance, feel free to contact us.</p>
      <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
    </div>`

  sendMail(details?.emailAddress, html)
}
