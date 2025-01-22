import mongoose from 'mongoose'

const objID = mongoose.Schema.Types.ObjectId

const visitorSchema = new mongoose.Schema(
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
    emailAddress: {
      type: String,
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
      enum: [
        'visitor',
        'vip',
        'contractor',
        'guest',
        'maintenance',
        'other',
        '',
      ],
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
    comment: {
      type: String,
      trim: true,
    },
    totalVisit: {
      type: Number,
      default: 0,
    },
    file: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in', 'out'],
      default: 'pending',
    },
    verified: {
      type: Boolean,
      default: true,
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
    companyId: {
      type: objID,
      required: true
    }
  },
  {
    timestamps: true,
  }
)

export const Visitor = mongoose.model('Visitor', visitorSchema)
