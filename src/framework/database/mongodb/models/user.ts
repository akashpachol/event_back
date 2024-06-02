import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  image: string | null;
  phone: string | null;
  isBlocked: boolean;
  isVender: boolean;
  isGoogle: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isBlock:boolean
}

const userSchema: Schema<UserDocument> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVender: {
      type: Boolean,
      default: false,
    },
    isManager: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isGoogle: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
   
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
