import mongoose from 'mongoose'

const SubscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
    },
    company: {
      type: String,
      default: 0,
    },
    duration: {
      type: Number,
      default: 1,
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

export const Subscription = mongoose.model('Subscription', SubscriptionSchema)
