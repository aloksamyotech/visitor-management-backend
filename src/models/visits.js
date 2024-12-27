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
    purpose: {
      type: String,
      trim: true,
      required: true,
    },
    relatedTo: {
      type: objID,
      ref: "User",
      // required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    entryType: {
      type: String,
      enum: ["visitor", "appointment", "pass", "other"], //can be changed
      // required: true,
    },
    passId: {
      type: objID,
      default: null
    },
    appointmentId: {
      type: objID,
      default: null
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
