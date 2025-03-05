

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { NotificationRepositoryMongoDbType } from "../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";
import { handleGetNotifications, handleUnreadGetNotifications } from "../../../application/use-cases/notification/notification";


export const notificationController = (
    notificationImpl: NotificationRepositoryMongoDbType,
   
  ) => {
    const notificationRepository = notificationImpl()


    const getNotifications=expressAsyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.params;
        const notifications=await handleGetNotifications(userId,notificationRepository)
        res.json({
            status:'success',
            message:'Notifications fetched successfully',
            data:notifications
        })
    })
    const getUnreadNotification=expressAsyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.params;
        const notifications=await handleUnreadGetNotifications(userId,notificationRepository)
        console.log(notifications,'fjfjj    ');
        
        res.json({
            status:'success',
            message:'Notifications fetched successfully',
            data:notifications
        })
    })
 
  
  
  
    return {
        getNotifications,
        getUnreadNotification

    }
  }
  
   