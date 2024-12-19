import mongoose from "mongoose";

const objID = mongoose.Schema.Types.ObjectId;

const PassSchema = new mongoose.Schema(
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
    passId: {
      type: String,
      unique: true,
      required: true,
    },
    passCode: {
      type: String,
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
      enum: ["1stFloor", "2stFloor", "fullAccess"],
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "blocked"],
      default: "active",
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
  },
);

module.exports = mongoose.model("Pass", PassSchema);
