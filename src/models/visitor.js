import mongoose from 'mongoose'

const objID = mongoose.Schema.Types.ObjectId

const visitorSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      enum: ['mr.', 'miss.', 'dr.', 'mrs.', ''],
      // required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      // required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    visitorType: {
      type: String,
      enum: ['visitor', 'vip', 'contractor', 'guest', 'maintenance', 'other'],
      required: true,
    },
    identityType: {
      type: String,
      enum: [
        'aadharCard',
        'panCard',
        'passport',
        'drivingLicence',
        'voterId',
        'other',
      ],
      required: true,
    },
    identityNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    totalVisit: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: objID,
      ref: 'User',
      required: true,
    },
    file: {
      type: String,
      // required: true
    },
  },
  {
    timestamps: true,
  }
)

export const Visitor = mongoose.model('Visitor', visitorSchema)
