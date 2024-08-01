

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { NotificationRepositoryMongoDbType } from "../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";
import { handleGetNotifications, handleReadNotification } from "../../../application/use-cases/notification/notification";


export const notificationController = (
    notificationImpl: NotificationRepositoryMongoDbType,
   
  ) => {
    const notificationRepository = notificationImpl()


    const getNotifications=expressAsyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.body;
        const notifications=await handleGetNotifications(userId,notificationRepository)
        console.log('notifications are ',notifications)
        res.json({
            status:'success',
            message:'Notifications fetched successfully',
            notifications
        })
    })

    const readNotifications=expressAsyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.body;
        await handleReadNotification(userId,notificationRepository)
        res.json({
            status:'success',
            message:'made notifications read',
        })
    })
  
  
  
    return {
        getNotifications,
        readNotifications
    }
  }
  
   