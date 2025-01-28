import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const objID = mongoose.Schema.Types.ObjectId
const userSchema = new Schema(
  {
    prefix: {
      type: String,
      enum: ['mr.', 'miss.', 'dr.', 'mrs.', ''],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'receptionist', 'security', 'guard', 'superAdmin'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    file: {
      type: String,
    },
    address: {
      type: String,
    },
    salary: {
      type: Number,
      default: 10000,
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    companyId: {
      type: objID,
      ref: 'User',
      default: null,
    },
    companyLogo: {
      type: String,
    },
    subscriptionDetails: {
      type: objID,
      ref: 'Subscription',
    },
    startDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)

  next()
})
userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next()

  this._update.password = await bcrypt.hash(this._update.password, 10)

  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema)
