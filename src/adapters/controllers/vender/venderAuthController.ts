import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../../framework/services/authService";

import { adminLogin } from "../../../application/use-cases/auth/adminAuth";
import { AuthServiceInterface } from "../../../application/services/authServiceInterface";
import { HttpStatus } from "../../../types/httpStatus";
import { UserDbInterface } from "../../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import expressAsyncHandler from "express-async-handler";
import { UserInterface } from "../../../types/userinterfaces";
import { verifyOTP } from "../../../application/use-cases/auth/venderAuth";
import { userRegister } from "../../../application/use-cases/auth/userAuth";

export default function venderAuthController(
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: UserDbInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB
) {
  const services = authServiceInterface(authServiceImpl());
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());

  const handleVenderLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    const { token, user, userId } = await adminLogin(
      email,
      password,
      services,
      dbRepositoryUser
    );

    res
      .status(HttpStatus.OK)
      .json({
        status: "success",
        message: "Admin has been logged in succesfull",
        token,
        admin: user,
        adminId: userId,
      });
  };

  const registerVender = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const user: UserInterface = req.body;

      await userRegister(req, user, dbRepositoryUser, services);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "User has received OTP successfully",
      });
    }
  );

  const verifyOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { otp } = req.body;

    const { token, user,userId } =
     await verifyOTP(
      req,
      otp,
      dbRepositoryUser,
      services
    );

    res.status(200).json({
      status: "success",
      message: "User has been registered successfully",
        token,
        user,
        userId
    });
  });

  return {
    handleVenderLogin,
    verifyOtp,
    registerVender,
  };
}
