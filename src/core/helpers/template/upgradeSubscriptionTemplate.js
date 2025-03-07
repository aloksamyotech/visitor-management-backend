import { sendMail } from '../sendMail.js'

export const upgradeSubscriptionTemplate = (details, subscription) => {
  const html = `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
      <h2 style="color: #4CAF50;">Subscription Upgrade Successful</h2>
      <p>Dear Sir/Madam,</p>
      <p>We are pleased to inform you that your company <strong>${details?.firstName}</strong> has successfully upgraded to the plan.</p>
      <h3>Subscription Details:</h3>
      <ul>
        <li><strong>Package Name:</strong> ${subscription?.title}</li>
        <li><strong>Price:</strong> ₹ ${subscription?.price}</li>
        <li><strong>Duration:</strong> ${subscription?.duration} days</li>
      </ul>
      <p>Thank you for choosing our services. You can now enjoy the premium features included in your new subscription plan.</p>
      <p>If you have any questions or need assistance, feel free to contact our support team</p>
      <p style="margin-top: 20px;">Best Regards,<br/>Visitor Management Team</p>
    </div>`

  sendMail(details?.emailAddress, html)
}
