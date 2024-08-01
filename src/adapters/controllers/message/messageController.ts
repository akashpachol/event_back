

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { HttpStatus } from "../../../types/httpStatus";
import { messageRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/messageRepositoryMongodb";
import { getMessages, handleGetAllUnreadMessages, handleGetUnreadMessagesFromChat, handleSetUnreadMessagesRead, messageSend } from "../../../application/use-cases/message/message";
import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";

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


  const getAllUnreadMessages=expressAsyncHandler(async(req:Request,res:Response)=>{
    const {userId}=req.body
   const messages= await handleGetAllUnreadMessages(userId,repository)
    res.status(200).json({
        status:'success',
        messages
    })
})
const getUnreadMessagesFromChat = expressAsyncHandler(async (req: Request, res: Response) => {
  const { chatId,userId } = req.body
  const messages = await handleGetUnreadMessagesFromChat(
      chatId,
      userId,
      repository
  )

  res.status(200).json({
      status: "success",
      data:messages
  });
})

const setUnreadMessagesRead=expressAsyncHandler(async(req:Request,res:Response)=>{
  const {chatId,userId}=req.body
  await handleSetUnreadMessagesRead(chatId,userId,repository)
  res.status(200).json({
      status:"success",
      message:'set unread messages read successfully'
  })
})





  return {
    allMesaages,
    sendMessage,
    setUnreadMessagesRead,
    getUnreadMessagesFromChat,
    getAllUnreadMessages
  };
};




















