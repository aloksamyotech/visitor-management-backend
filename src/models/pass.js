import mongoose from 'mongoose'

const objID = mongoose.Schema.Types.ObjectId

const PassSchema = new mongoose.Schema(
  {
    visitor: {
      type: objID,
      ref: 'Visitor',
      required: true,
    },
    employee: {
      type: objID,
      ref: 'User',
      required: true,
    },
    passCode: {
      type: String,
      unique: true,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    setAccess: {
      type: String,
      required: true,
      enum: ['1stFloor', '2ndFloor', 'fullAccess', 'restricted'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'blocked'],
      default: 'active',
    },
    count: {
      type: Number,
      default: 0,
    },
    maxCount: {
      type: Number,
      default: 100,
    },
    dailyCount: {
      type: Number,
      default: 0,
    },
    maxEntryPerDay: {
      type: Number,
      default: 5,
    },
    duration: {
      type: Number,
      default: 2,
    },
    comment: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Pass = mongoose.model('Pass', PassSchema)
