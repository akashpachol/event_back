import { messageRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/messageRepositoryMongodb";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const messageDeleteEveryOne = async (
    messageId:string,
  
 
  repository: ReturnType<messageRepositoryMongoDBType>
) => {
  if ( !messageId) {
    throw new AppError(
      "chatId param not sent with request",
      HttpStatus.BAD_REQUEST
    );
  }

 let data={isDeleted:true} 
        const updateMessage=await repository.deleteMessagedb(messageId,data)


  return true;
};





export const messageDelete = async (
    messageId:string,
  
  userId: string,
 
  repository: ReturnType<messageRepositoryMongoDBType>
) => {
  if (!userId ||!messageId) {
    throw new AppError(
      "chatId param not sent with request",
      HttpStatus.BAD_REQUEST
    );
  }

 let data={deletedBy:userId} 
        const updateMessage=await repository.deleteMessagedb(messageId,data)


  return true;
};
