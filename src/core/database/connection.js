import mongoose from 'mongoose'
import { database_urls } from '../common/constant.js'
import 'dotenv/config'
import process from 'node:process'
import { User } from '../../models/user.js'

const connectDB = async () => {
  try {
    ;(async function () {
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
      }
    })()
  } catch (error) {
    console.error('database connection failed:', error?.message)
    process.exit(1)
  }
}

export default connectDB
