import mongoose from 'mongoose'
const objID = mongoose.Schema.Types.ObjectId
const appointmentSchema = new mongoose.Schema(
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
    reference: {
      type: objID,
      ref: 'User',
      default: null,
    },
    purpose: {
      type: String,
      enum: ['visitor', 'meeting', 'maintenance', 'other'],
      required: true,
    },
    duration: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      // required:true
    },
    comment: {
      type: String,
      trim: true,
    },
    appointmentId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'checkIn'],
      default: 'pending',
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

export const Appointment = mongoose.model('Appointment', appointmentSchema)
