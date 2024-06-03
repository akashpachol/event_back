import { HttpStatus } from "../../../types/httpStatus";
import { Request } from "express";
import { AuthServiceInterface } from "../../services/authServiceInterface";
import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import  { UserEntityType } from "../../../entities/user";
import sendVerifyMail from "../../../utils/mailler";



export const userRegister = async (
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

export const resendOtp = async (
  req: Request,
  email:string,
  authService: ReturnType<AuthServiceInterface>
) => {
 

  let userData;
  if(req.session.userData ||req.session.email){
     userData=req.session.userData||req.session.email ;
  }else{
    throw new AppError(
      "User data not found in session",
      HttpStatus.UNAUTHORIZED,
    );
  }

  
    
delete req.session.otp 
    const otp = await authService.generateOTPValue();
  
    console.log(otp,"sessionOTP");

    req.session.otp = otp;
    req.session.otpGeneratedTime = Date.now();

    const value = await sendVerifyMail(email, otp);

    return { otp };
  
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
      password: userData.password
    }

 
    const createdUser: any = await userRepository.addUserValue(userEntity);

    

  
    const token = authService.generateTokenValue(createdUser._id.toString());

    return { token, user:createdUser?.username,userId:createdUser._id };
};
export const loginUser = async (
  req: Request,
  email: string,
  password: string,
  userRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {

    const user = await userRepository.getUserByEmailValue(email);

    if (!user) {
      throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
    }
    if (!user._id) {
      throw new AppError(
        "User ID is missing",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const isPasswordCorrect = await authService.comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
    }
    if(user.isGoogle){
      throw new AppError("Person is google user", HttpStatus.UNAUTHORIZED);

    }


    await authService.cleanUpSessionValue(req);


    const token = authService.generateTokenValue(user._id.toString());

    return { token, user: user?.username,userId:user._id };

};

export  const authGoogle = async (
  req: Request,
  userData: {
    username: string;
    email: string;
 
  },
  userRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {

  
    const userEntity ={
      username:userData.username,
      email:userData.email,
      password:"12345678"
    }
    
    


 
    const createdUser: any = await userRepository.addGoogleUserValue(userEntity);


    

  
    const token = authService.generateTokenValue(createdUser._id.toString());

    return { token, user:createdUser?.username,userId:createdUser._id  };
};

export const forgot = async (
  req: Request,
  email:string,
  userRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {

 
  const user = await userRepository.getUserByEmailValue(email);
 
  if(!user ){
    throw new AppError(
      "User data not found in session",
      HttpStatus.UNAUTHORIZED,
    );
  }

  
    
delete req.session.otp 
    const otp = await authService.generateOTPValue();
    req.session.email=email
    console.log(otp,"sessionOTP");

    req.session.otp = otp;
    req.session.otpGeneratedTime = Date.now();

    const value = await sendVerifyMail(email, otp);

    return { emailValue:email };
  
};


export const reset = async (
  req: Request,
  old: string,
  password: string,
  userRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const email:any=req.session.email


    const user:any = await userRepository.getUserByEmailValue(email);

    if (!user) {
      throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
    }
    if (!user._id) {
      throw new AppError(
        "User ID is missing",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const isPasswordCorrect = await authService.comparePassword(
      old,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
    }
    let id:any=user._id

    const userData = await userRepository.updateUserByPropertyValue(id, {password});
   
    
console.log(userData,"khkfjhkdjh");



    return ;

};


export const forgotVerifyOTP = async (
  req: Request,
  otp: string,

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

    return ;
};
