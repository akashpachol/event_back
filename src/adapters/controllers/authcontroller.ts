import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UserRepositoryMongoDB } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { AuthService } from "../../framework/services/authService";
import { UserInterface } from "../../entities/userinterfaces";
import {
  userRegister,
  verifyOTP,
  loginUser,
  authGoogle,
  resendOtp,
  forgot,
  reset,
  forgotVerifyOTP,
} from "../../application/use-cases/auth/userAuth";

const authController = (
  authServiceImpl: AuthService,

  userDbRepositoryImpl: UserRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepositoryImpl();
  const authService = authServiceImpl();

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user: UserInterface = req.body;

    await userRegister(user, dbRepositoryUser, authService);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "User has received OTP successfully",
    });
  });

  const otpResend = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const { otp } = await resendOtp(email, authService);

    res.status(200).json({
      status: "success",
      otp,
      message: "User has received OTP successfully",
    });
  });

  const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { otp } = req.body;

    const { token, user, userId } = await verifyOTP(
      otp,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User has been registered successfully",
      token,
      user,
      userId,
    });
  });

  const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password,role }: { email: string; password: string,role:string } = req.body;

    const { token, user, userId } = await loginUser(
      email,
      password,
      role,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User verified",
      token,
      user,
      userId,
    });
  });

  const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email,role } = req.body;

    const { emailValue } = await forgot(email,role, dbRepositoryUser, authService);

    res.status(200).json({
      status: "success",
      type: "forgot",
      email: emailValue,
      message: "User has received OTP successfully",
    });
  });

  const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const {  password }: { oldpassword: string; password: string } =
      req.body;

    const data = await reset(
   
      password,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User password update successfully",
    });
  });

  const googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserInterface = req.body;

    const { token, user, userId } = await authGoogle(
      userData,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User authenticated successfully",
      token,
      user,
      userId,
    });
  });
  const verifyOtpforgot = asyncHandler(async (req: Request, res: Response) => {
    const { otp } = req.body;

    await forgotVerifyOTP(otp, authService);

    res.status(200).json({
      status: "success",
      message: "otp verfy succesfully successfully",
    });
  });

  return {
    registerUser,
    verifyOtp,
    userLogin,
    googleAuth,
    otpResend,
    forgotPassword,
    resetPassword,
    verifyOtpforgot,
  };
};

export default authController;
