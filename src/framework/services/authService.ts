import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import configKeys from "../../config";

import jwtDecode from "jwt-decode";
import { Request } from "express";

export const authService = () => {
  const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
  };

  const comparePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  };

  const generateToken = (payload: string) => {
    const token = jwt.sign({ payload }, configKeys.JWT_SECRET, {
      expiresIn: "5d",
    });
    const refreshToken = jwt.sign({ payload }, configKeys.JWT_REFRESH_SECRET, {
      expiresIn: "59m",
    });

    return token;
  };

  const verifyToken = (token: string) => {
    return jwt.verify(token, configKeys.JWT_SECRET);
  };

  const generateOTP = async () => {
    const characters = "0123456789"; // The characters to use for the OTP
    let otp = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  };

  const verifyOTP = async (otp: string, sessionotp: string | undefined) => {
    if (otp === sessionotp) {
      return true;
    } else {
      return false;
    }
  };
  const cleanUpSession = (req: Request) => {
    const sessionData = req.session!;
    delete sessionData.otp;
    delete sessionData.otpGeneratedTime;
  };

  return {
    encryptPassword,
    comparePassword,
    generateToken,
    verifyToken,
    generateOTP,
    verifyOTP,
    cleanUpSession,
    // verifyAdmin,
  };
};

export type AuthService = typeof authService;

export type AuthServiceReturn = ReturnType<AuthService>;
