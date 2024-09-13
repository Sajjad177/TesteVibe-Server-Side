import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./user.interface";

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: "Update your address",
    },
    city: {
      type: String,
      default: "Update your city",
    },
    country: {
      type: String,
      default: "Update your country",
    },
    profilePic: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    //TODO :  Advance authentication

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true } // User create time showing
);

export const User = mongoose.model("User", userSchema);
