import { sendMail } from '../sendMail.js'
import moment from 'moment'

export const entryVisitorTemplate = (details) => {
  const checkInTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  const html = `<div style="font-family: Arial, sans-serif; padding: 20px;border: 1px solid #ddd;">
          <h2 style="color: #4CAF50;">Hello ${details?.firstName},</h2>
          <p>We are pleased to inform you that your entry has been recorded successfully.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><b>Check-in Time:</b> ${checkInTime}</li>
          </ul>
          <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
        </div>`
  sendMail(details?.emailAddress, html)
}
