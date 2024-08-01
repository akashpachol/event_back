import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";




export const getChats = async (
    userId:string,
    repository: ReturnType<chatRepositoryMongoDBType>
  ) => {
   

    if (!userId ) {
        throw new AppError(
          "UserId param not sent with request",
          HttpStatus.BAD_REQUEST
        );
      }
  
    const chat = await repository.chatGet(userId);
  
    return chat;
  };



 