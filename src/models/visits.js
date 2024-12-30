import mongoose from "mongoose";

const objID = mongoose.Schema.Types.ObjectId;

const visitSchema = new mongoose.Schema(
  {
    visitor: {
      type: objID,
      ref: "Visitor",
      required: true,
    },
    employee: {
      type: objID,
      ref: "User",
      required: true,
    },
    entryTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    relatedTo: {
      type: objID,
      ref: "User",
      // required: true,
    },
    entryType: {
      type: String,
      enum: ["visitor", "appointment", "pass", "other"],
      // required: true,
    },
    passId: {
      type: objID,
      ref: "Pass",
      default: null,
    },
    appointmentId: {
      type: objID,
      ref: "Appointment",
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
export const Visit = mongoose.model("Visit", visitSchema);
