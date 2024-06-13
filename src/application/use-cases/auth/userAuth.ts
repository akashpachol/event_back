import { HttpStatus } from "../../../types/httpStatus";

import AppError from "../../../utils/appError";
import  { UserEntityType } from "../../../entities/user";
import {sendVerifyMail} from "../../../utils/mailler";
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { AuthService } from "../../../framework/services/authService";




let userData: { username?: string; email?: string; password?: string,role?:string } | null = null;
let otp: string | null = null;
let otpGeneratedTime: number | null = null;

export const userRegister = async (
  user: {
    username: string;
    email: string;
    password: string;
    role:string
  },
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  try {
  
    if (!user.email ||!user.username ||!user.email ||!user.password ||!user.role ) {
      throw new AppError("please fill the form", HttpStatus.BAD_REQUEST);
    }
    user.email = user.email.toLowerCase();
    const isExistingEmail = await userRepository.getUserByEmail(user.email,user.role);
    if (isExistingEmail) {
      throw new AppError("This email is already registered with an account", HttpStatus.UNAUTHORIZED);
    }
    user.password = await authService.encryptPassword(user.password);
    userData = user;
    const otpValue = await authService.generateOTP();
    otp = otpValue;
    console.log(otp)
    otpGeneratedTime = Date.now();
    await sendVerifyMail(user.email, otp);
    return;
  } catch (error) {
    throw new AppError("User registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const resendOtp = async (
  email: string,
  
  authService: ReturnType<AuthService>
) => {
  if (!userData || userData.email !== email) {
    throw new AppError("User data not found", HttpStatus.UNAUTHORIZED);
  }

  const otpValue = await authService.generateOTP();
  otp = otpValue;
  console.log(otp, "sessionOTP");
  otpGeneratedTime = Date.now();

  await sendVerifyMail(email, otp);

  return { otp };
};

export const verifyOTP = async (
  inputOtp: string,
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  if (!inputOtp) {
    throw new AppError("Please provide a valid OTP", HttpStatus.UNAUTHORIZED);
  }

  if (!otp || !otpGeneratedTime) {
    throw new AppError("OTP or OTP generated time not found", HttpStatus.UNAUTHORIZED);
  }

  const currentTime = Date.now();
  const otpValidityPeriod = 60000;

  if (currentTime - otpGeneratedTime > otpValidityPeriod) {
    throw new AppError("OTP has expired", HttpStatus.UNAUTHORIZED);
  }

  const isValidOtp = await authService.verifyOTP(inputOtp, otp);

  if (!isValidOtp) {
    throw new AppError("Invalid OTP. Please provide a valid OTP", HttpStatus.UNAUTHORIZED);
  }

  if (!userData) {
    throw new AppError("User data not found", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const userEntity:UserEntityType = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role:userData.role,
  };

  const createdUser: any = await userRepository.addUser(userEntity);

  const token = authService.generateToken(createdUser._id.toString());

  return { token, user: createdUser.username, userId: createdUser._id };
};

export const loginUser = async (
  email: string,
  password: string,
  role:string,
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  const user = await userRepository.getUserByEmail(email,role);

  if (!user) {
    throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
  }
  if (!user._id) {
    throw new AppError("User ID is missing", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (user.isBlocked) {
    throw new AppError("User is blocked", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const isPasswordCorrect = await authService.comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
  }

  const token = authService.generateToken(user._id.toString());

  return { token, user: user.username, userId: user._id };
};

export const authGoogle = async (
  userData: {
    username: string;
    email: string;
    role:string
  },
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  const userEntity = {
    username: userData.username,
    email: userData.email,
    password: "12345678",
    role:userData.role
  };

  const createdUser: any = await userRepository.addGoogleUser(userEntity);

  const token = authService.generateToken(createdUser._id.toString());

  return { token, user: createdUser.username, userId: createdUser._id };
};

export const forgot = async (
  email: string,
  role:string,
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  const user = await userRepository.getUserByEmail(email,role);

  if (!user) {
    throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
  }



  const otpValue = await authService.generateOTP();
  otp = otpValue;
  console.log(otp, "sessionOTP");
  otpGeneratedTime = Date.now();

  await sendVerifyMail(email, otp);

  userData = { ...userData, email,role };

  return { emailValue:email};
};

export const reset = async (
  newPassword: string,
  userRepository: ReturnType<UserRepositoryMongoDB>,
  authService: ReturnType<AuthService>
) => {
  if (!userData?.email ) {
    throw new AppError("Email not found", HttpStatus.UNAUTHORIZED);
  }
  if (!userData?.role ) {
    throw new AppError("role not found", HttpStatus.UNAUTHORIZED);
  }

  const user = await userRepository.getUserByEmail(userData.email,userData.role);

  if (!user) {
    throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
  }
  if (!user._id) {
    throw new AppError("User ID is missing", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  let user_id = user._id.toString();
  const encriptPassword = await authService.encryptPassword(newPassword);

let data={ password: encriptPassword }


  const updatedUser = await userRepository.updateUserByProperty(user_id, data);

  return ;
};

export const forgotVerifyOTP = async (

  inputOtp: string,

  authService: ReturnType<AuthService>
) => {
  if (!inputOtp) {
    throw new AppError("Please provide a valid OTP", HttpStatus.UNAUTHORIZED);
  }

  if (!otp || !otpGeneratedTime) {
    throw new AppError("OTP or OTP generated time not found", HttpStatus.UNAUTHORIZED);
  }

  const currentTime = Date.now();
  const otpValidityPeriod = 60000;

  if (currentTime - otpGeneratedTime > otpValidityPeriod) {
    throw new AppError("OTP has expired", HttpStatus.UNAUTHORIZED);
  }

  const isValidOtp = await authService.verifyOTP(inputOtp, otp);

  if (!isValidOtp) {
    throw new AppError("Invalid OTP. Please provide a valid OTP", HttpStatus.UNAUTHORIZED);
  }

  return { otp };
};

