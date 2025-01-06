import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    prefix: {
      type: String,
      enum: ["mr.", "miss.", "dr.", "mrs.", ""],
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
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "hr", "receptionist", "security", "guard"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    file: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      default: 10000,
      // required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          "user",
          "manageEntry",
          "visitor",
          "appointment",
          "passes",
          "report",
          "calender",
        ],
      },
    ],
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
