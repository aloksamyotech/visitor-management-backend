import cron from 'node-cron'
import { Pass } from '../models/pass.js'

export const ResetDailyLimit = async () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await Pass.updateMany({}, { dailyCount: 0 })
    } catch (error) {
      console.error('Error resetting daily limit:', error)
    }
  })
}

export const CheckCompanySubscriptionExpiry = async () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date()
      await User.updateMany(
        { expiryDate: { $lt: today }, active: true },
        { $set: { active: false } }
      );
    } catch (error) {
      console.error("Error updating active :", error);
    }
  })
}