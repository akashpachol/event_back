import asyncHandler from "express-async-handler";


import {  Request, Response } from "express";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../../types/httpStatus";
import {
  getUserProfile,
  updateProfileImg,
  updateUserProfile,
} from "../../application/use-cases/user/userDetails";
const userController = (
  userDbRepository: UserDbInterface,
  userDbRepositoryImpl: UserRepositoryMongoDB
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());

  const handleGetUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
      const userId: any = req.params.userId;
      const data = await getUserProfile(userId, dbRepositoryUser);
      console.log(data,'jkfhdkjfhdjkfh');
      
      res.status(HttpStatus.OK).json({
        status: "success",
        message: "User Details has been feteched",
        data,
      });
    }
  );

  const handleUpdateUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
      const userId: any | null = req.params.userId;
      const updates: any | null = req.body;

      const data = await updateUserProfile(userId, updates, dbRepositoryUser);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "User profile has been updated",
        
      });
    }
  );

  const handleUpdateProfileImage = asyncHandler(
    async (req: Request, res: Response) => {
      const userId: any | null = req.params.userId;
      const {secure_url} = req.body;

       const data = await updateProfileImg(userId, secure_url , dbRepositoryUser);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "User profile img has been updated",
        
      });
    }
  );

  


  return {
    handleGetUserProfile,
    handleUpdateUserProfile,
    handleUpdateProfileImage
  };
};

export default userController;
