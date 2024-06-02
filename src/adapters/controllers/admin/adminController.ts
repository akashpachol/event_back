import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler";
import { UserDbInterface } from "../../../application/repositories/userDbRepository";
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import { blockuser, getAllUsers } from "../../../application/use-cases/user/userDetails";

export default function adminController(
    userDbRepository: UserDbInterface,
    userDbRepositoryImpl: UserRepositoryMongoDB,
 

  ) {
    const userRespository = userDbRepository(userDbRepositoryImpl());

  
    const handleGetAllUsers = asyncHandler(
      async (req: Request, res: Response) => {
        console.log("got to admin user fetching api");
  
        const data = await getAllUsers(userRespository);
  
        res.status(HttpStatus.OK).json({
          status: "success",
          message: "All users details has been fetched",
          data: data,
        });
      }
    );

    const handleBlockUsers = asyncHandler(
      async (req: Request, res: Response) => {
      
        const userId: any = req.params.userId;
        const {data,message} = await blockuser( userId,userRespository);
  
        res.status(HttpStatus.OK).json({
          status: "success",
          message,
        data,
        });
      }
    );

    return {
        handleGetAllUsers,
        handleBlockUsers
      
      };
  }