import asyncHandler from "express-async-handler";

import { Request, Response } from "express";
import { UserRepositoryMongoDBType } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../../types/httpStatus";
import {
  getSerachData,
  getSerachLocationData,
  getUserProfile,
  
  managerGet,
  
  updateProfileImg,
  updateUserProfile,
} from "../../application/use-cases/user/userDetails";

import { locationRepositoryMongoDBType } from "../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { walletRepositoryMongoDBType } from "../../framework/database/mongodb/repositories/walletRepositoryMongoDB";
import {  walletGet } from "../../application/use-cases/location/get";
const userController = (
  userDbRepositoryImpl: UserRepositoryMongoDBType,
  locationDbRepositoryImpl: locationRepositoryMongoDBType,
  walletDbRepositoryImpl: walletRepositoryMongoDBType
) => {
  const dbRepositoryUser = userDbRepositoryImpl();
  const dbRepositoryLocation = locationDbRepositoryImpl();
  const dbRepositoryWallet = walletDbRepositoryImpl();

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
      const { secure_url } = req.body;

      const data = await updateProfileImg(userId, secure_url, dbRepositoryUser);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "User profile img has been updated",
      });
    }
  );



  const allUsers = asyncHandler(async (req: Request, res: Response) => {
    
   const role= req.query.role as string
   const id= req.query.id as string
   const search = typeof req.query.search === 'string' ? req.query.search : undefined; 
    const data = await getSerachData(search,role,id,dbRepositoryUser);


    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });


  

  const getSearchLocation = asyncHandler(async (req: Request, res: Response) => {
    const data= req.query.data as string
    console.log(data,'kkkkkk');
    
     const locationData = await getSerachLocationData(data,dbRepositoryUser);
 
 
     res.status(HttpStatus.OK).json({
       status: "success",
       message: "All users details has been fetched",
       data:locationData
     });
   });





  const getWallet = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = await walletGet(userId, dbRepositoryWallet);

    res.status(HttpStatus.OK).json({
      status: "success",
      message: "wallet details fetched",
      data,
    });
  });
  const getManger = asyncHandler(async (req: Request, res: Response) => {
    const  role = req.query.role as string;
    const  id = req.query.id as string;

console.log(role,id);

    const data = await managerGet(role,id,dbRepositoryUser);

    res.status(HttpStatus.OK).json({
      status: "success",
      message: "wallet details fetched",
      data,
    });
  });





  return {
    handleGetUserProfile,
    handleUpdateUserProfile,
    handleUpdateProfileImage,
    getSearchLocation,
    getWallet,
    allUsers,
    getManger
    
  };
};

export default userController;
