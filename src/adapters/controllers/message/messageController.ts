

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { HttpStatus } from "../../../types/httpStatus";
import { messageRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/messageRepositoryMongodb";
import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";
import { getMessages } from "../../../application/use-cases/message/get";
import {  messageSend } from "../../../application/use-cases/message/create";
import { messageDelete, messageDeleteEveryOne } from "../../../application/use-cases/message/edit";

export const messageController = (
  messageRepoimpl: messageRepositoryMongoDBType,
  chatRepoimpl:chatRepositoryMongoDBType
) => {
  const repository = messageRepoimpl()
  const chatRepository = chatRepoimpl()


  const allMesaages = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId  = req.query.userId as string;
    const chatId  = req.query.chatId as string;

    
       const fullChat=await getMessages(userId,chatId,repository)
  

    res.status(HttpStatus.OK).json({
      status: "success",
      message: "get all messages",
      data:fullChat
    });
  });

  const sendMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  
    const { userId,chatId,content} = req.body;

        const data=await messageSend(content,chatId,userId,repository,chatRepository)

        res.status(HttpStatus.OK).json({
            status: "success",
            message: "message posted",
            data
          });
  });

  const deleteForEveryOneMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  
    const { messageId} = req.body;

        const data=await messageDeleteEveryOne(messageId,repository)

        res.status(HttpStatus.OK).json({
            status: "success",
            message: "message posted",
            data
          });
  });
  const deleteForMeMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  
    const { userId,messageId} = req.body;

        const data=await messageDelete(messageId,userId,repository)

        res.status(HttpStatus.OK).json({
            status: "success",
            message: "message posted",
            data
          });
  });




  









  return {
    allMesaages,
    sendMessage,
    deleteForEveryOneMessage,
    deleteForMeMessage
   
  };
};




















