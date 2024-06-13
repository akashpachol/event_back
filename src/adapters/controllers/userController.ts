import asyncHandler from "express-async-handler";


import {  Request, Response } from "express";
import { UserRepositoryMongoDB } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../../types/httpStatus";
import {
  getUserProfile,
  updateProfileImg,
  updateUserProfile,
} from "../../application/use-cases/user/userDetails";
import { verifyLocationGet } from "../../application/use-cases/location/verifyLocation";
import { locationRepositoryMongoDBType } from "../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
const userController = (
  userDbRepositoryImpl: UserRepositoryMongoDB,
  locationDbRepositoryImpl:locationRepositoryMongoDBType ,
) => {
  const dbRepositoryUser = userDbRepositoryImpl();
  const dbRepositoryLocation = locationDbRepositoryImpl();


  const handleGetUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
      const userId: any = req.params.userId;
      const data = await getUserProfile(userId, dbRepositoryUser);
  
      
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


  const getVerifyLocation= asyncHandler(async (req: Request, res: Response) => {

    const data=await verifyLocationGet(dbRepositoryLocation);

 
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });



  


  return {
    handleGetUserProfile,
    handleUpdateUserProfile,
    handleUpdateProfileImage,
    getVerifyLocation,

  };
};

export default userController;
