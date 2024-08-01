

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";


import { HttpStatus } from "../../../types/httpStatus";
import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";
import { createChat, groupChatCreate } from "../../../application/use-cases/chat/create";
import { getChats } from "../../../application/use-cases/chat/get";

export const chatController = (
  chatRepoimpl: chatRepositoryMongoDBType
) => {
  const repository = chatRepoimpl()


  const accessChat = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId,receiverId } = req.body;
    
       const fullChat=await createChat(userId,receiverId,repository)
  

    res.status(HttpStatus.OK).json({
      status: "success",
      message: "chat successfully created",
      data:fullChat
    });
  });

  const fetchChats = expressAsyncHandler(async (req: Request, res: Response) => {
  
    const {userId}=req.params

        const data=await getChats(userId,repository)


        res.status(HttpStatus.OK).json({
            status: "success",
            message: "All chat has been fetched",
         data
          });
  });
  const createGroupChat= expressAsyncHandler(async (req: Request, res: Response) => {
  
    const {users,name,userId}=req.body

        const data=await groupChatCreate(users,name,userId,repository)


        res.status(HttpStatus.OK).json({
            status: "success",
            message: "All group chat  has been fetched",
         data
          });
  });
  




  return {
    accessChat,
    fetchChats,
    createGroupChat
  };
};




















