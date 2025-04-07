import moment from 'moment';
import { sendMail } from '../sendMail.js'

export const scheduleApnTemplate = (details, appointment) => {
  const date = moment.utc(appointment?.date).local().format('ll');
  const startTime = moment(appointment?.startTime, "HH:mm").format("hh:mm A");
  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
        <h2 style="color: #4CAF50;">Hello ${details?.firstName},</h2>
        <p>Your appointment has been successfully scheduled.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${startTime}</li>
        </ul>
        <p>Please make sure to arrive on time. If you have any questions or need to reschedule, feel free to contact us</p>
        <p>We look forward to welcoming you!</p>
        <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
      </div>`
  sendMail(details?.emailAddress, html)
}
