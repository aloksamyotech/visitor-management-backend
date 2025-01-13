import mongoose from 'mongoose'

const objID = mongoose.Schema.Types.ObjectId

const visitorHistorySchema = new mongoose.Schema(
  {
    visitor: {
      type: objID,
      ref: 'Visitor',
      required: true,
    },
    visitHistory: [
      {
        type: objID,
        ref: 'Visit',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)
export const VisitorHistory = mongoose.model(
  'VisitorHistory',
  visitorHistorySchema
)
