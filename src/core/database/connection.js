import mongoose from 'mongoose'
import { database_urls } from '../common/constant.js'
import 'dotenv/config'
import process from 'node:process'
import { User } from '../../models/user.js'
import { Subscription } from '../../models/subscription.js'

const connectDB = async () => {
  try {
    ; (async function () {
      const dbUri = database_urls?.connection + database_urls?.db_name
      const dbConnect = await mongoose.connect(dbUri, {})
      if (dbConnect) {
        const existingAdmin = await User.findOne({
          emailAddress: 'admin@gmail.com',
        })
        if (!existingAdmin) {
          const userData = new User({
            firstName: 'Admin',
            lastName: '',
            gender: 'male',
            phoneNumber: '1234567890',
            emailAddress: 'admin@gmail.com',
            password: 'admin123',
            role: 'superAdmin',
            address: 'USA',
          })
          await userData.save()
          console.log(`New Admin is Created`)
        }
        const checkPackage = await Subscription.findOne({
          title: 'Free Trial',
        })
        if (!checkPackage) {
          const subscription = new Subscription({
            title: 'Free Trial',
            price: 0,
            description: 'Enjoy a FREE trial with full access to features',
            duration: 30
          })
          await subscription.save()
          console.log(`Free Trial Subscription Added`)
        }
      }
    })()
  } catch (error) {
    console.error('database connection failed:', error?.message)
    process.exit(1)
  }
}

export default connectDB
