import { HttpStatus } from "../../../types/httpStatus";
import { Request } from "express";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import  { UserEntityType } from "../../../entities/user";
import sendVerifyMail from "../../../utils/mailler";


export const venderRegister = async (
    req: Request,
    user: {
      username: string;
      email: string;
      password: string;
    },
    userRepository: ReturnType<UserDbInterface>,
    authService: ReturnType<AuthServiceInterface>
  ) => {
    try {
      user.email = user.email.toLowerCase();
  
      const isExistingEmail = await userRepository.getUserByEmailValue(user.email);
      if (isExistingEmail) {
        throw new AppError("This email is already registered with an account", HttpStatus.UNAUTHORIZED);
      }
  
      user.password = await authService.encryptPasswordValue(user.password);
  
      req.session.userData = user;
  
      const otp = await authService.generateOTPValue();
      console.log(otp, "sessionOTP");
      req.session.otp = otp;
      req.session.otpGeneratedTime = Date.now();
  
      const value = await sendVerifyMail(user.email, otp);
  
      return { value };
    } catch (error) {
      throw new AppError("User registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  export const verifyOTP = async (
    req: Request,
    otp: string,
    userRepository: ReturnType<UserDbInterface>,
    authService: ReturnType<AuthServiceInterface>
  ) => {
  
      if (!otp) {
        throw new AppError("Please provide a valid OTP", HttpStatus.UNAUTHORIZED);
      }
  
      const sessionOTP = req.session.otp;
    
      
      const otpGeneratedTime= req.session.otpGeneratedTime;
      if (!otpGeneratedTime) {
        throw new AppError("OTP generated time not found", HttpStatus.UNAUTHORIZED);
      }
      
      const currentTime = Date.now();
      const otpValidityPeriod = 60000; 
    
      if (currentTime - otpGeneratedTime > otpValidityPeriod) {
        throw new AppError("OTP has expired", HttpStatus.UNAUTHORIZED);
      }
  
    
      const verification = await authService.verifyOTPValue(otp, sessionOTP);
  
      if (!verification) {
        throw new AppError(
          "Invalid OTP. Please provide a valid OTP",
          HttpStatus.UNAUTHORIZED
        );
      }
  
      
      const userData = req.session.userData as UserEntityType;
    
      if (!userData) {
        throw new AppError(
          "User data not found in session",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
  
  
  
  
      const userEntity ={
        username:userData.username,
        email:userData.email,
        password: userData.password,
        isVender:true
      }
  
   
      const createdUser: any = await userRepository.addUserValue(userEntity);
  
      
  
    
      const token = authService.generateTokenValue(createdUser._id.toString());
  
      return { token, user:createdUser?.username,userId:createdUser._id };
  };

  export const adminLogin = async (email: string, password: string, services:ReturnType<AuthServiceInterface>, userRepository: ReturnType<UserDbInterface>, ) =>{
    const user = await userRepository.getUserByEmailValue(email);

   
    if (!user ) {
        throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
      }
      if (!user._id ) {
        throw new AppError("User ID not found", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!user.isVender) {
        throw new AppError("User is NOT FOUND", HttpStatus.FORBIDDEN);
      }
      const isPasswordCorrect = await services.comparePassword(
        password,
        user.password
      );
  
      if (!isPasswordCorrect) {
        throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
      }
  
  
  
  
  
      const token = services.generateTokenValue(user._id.toString());

    return { token, user: user?.username,userId:user._id };


}