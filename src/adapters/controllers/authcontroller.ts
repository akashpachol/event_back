import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { AuthService } from "../../framework/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterface";
import { UserInterface } from "../../types/userinterfaces";
import {
  userRegister,
  verifyOTP,
  loginUser,
  authGoogle,
  resendOtp,
  logout
} from "../../application/use-cases/auth/userAuth";


const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: UserDbInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user: UserInterface = req.body;

    await userRegister(req, user, dbRepositoryUser, authService);

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "User has received OTP successfully",
    });
  });


  const otpResend = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

   const {otp}= await resendOtp(req,email, authService);

    res.status(200).json({
      status: "success",
      otp,
      message: "User has received OTP successfully",
    });
  });


  const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { otp } = req.body;

    const { token, user,userId } = await verifyOTP(
      req,
      otp,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User has been registered successfully",
      token,
      user,
      userId
    });
  });

  const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    const { token, user,userId } = await loginUser(
      req,
      email,
      password,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User verified",
      token,
      user,
      userId
    });
  });

  const googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserInterface = req.body;


    const {token,user,userId} = await authGoogle(
      req,
      userData,
      dbRepositoryUser,
      authService
    );

    res.status(200).json({
      status: "success",
      message: "User authenticated successfully",
      token,user,userId
    });
  });


  const userLogout = asyncHandler(async (req: Request, res: Response) => {



    const value = await logout(
      req, 
    );

    res.status(200).json({
      status: "success",
      message: "User logout successfully",

    });
  });

  return {
    registerUser,
    verifyOtp,
    userLogin,
    googleAuth,
    otpResend,
    userLogout
  };
};

export default authController;
