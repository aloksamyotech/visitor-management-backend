import mongoose from 'mongoose'

const objID = mongoose.Schema.Types.ObjectId
const PaymentSchema = new mongoose.Schema(
  {
    companyId: {
      type: objID,
      ref: 'User',
    },
    subscriptionId: {
      type: objID,
      ref: 'Subscription',
    },
    paymentType: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      default: null,
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

export const Payment = mongoose.model('Payment', PaymentSchema)
