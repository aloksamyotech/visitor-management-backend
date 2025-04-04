import { sendMail } from '../sendMail.js'
import moment from 'moment';

export const exitVisitorTemplate = (details) => {
  const checkOutTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  const html = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #4CAF50;">Hello ${details?.firstName},</h2>
      <p>Thank you for visiting. We hope you had a great experience.</p>
      <p><strong>Details:</strong></p>
          <ul>
            <li><b>Exit Time:</b> ${checkOutTime}</li>
          </ul>
      <p>We look forward to welcoming you again in the future!</p>
      <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
    </div>`

  sendMail(details?.emailAddress, html)
}
