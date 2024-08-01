import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const createChat = async (
  userId: string,
  receiver: string,
  repository: ReturnType<chatRepositoryMongoDBType>
) => {
  if (!userId || !receiver) {
    throw new AppError(
      "UserId param not sent with request",
      HttpStatus.BAD_REQUEST
    );
  }

  let chat = await repository.accessChat(userId, receiver);
 

  if(!chat){
    const newChat=await repository.createChat(userId,receiver)


    if (newChat && newChat._id) {
        chat = await repository.getFullChat(newChat._id);
    }
}

  return chat;
};




  export const groupChatCreate = async (
    users:string[],
    name:string,
    userId:string,
    repository: ReturnType<chatRepositoryMongoDBType>
  ) => {
   

    if (!users||!name ) {
        throw new AppError(
          "Please Fill all the feilds",
          HttpStatus.BAD_REQUEST
        );
      }

      if (users.length < 2 ) {
        throw new AppError(
          "More than 2 users are required to form a group chat",
          HttpStatus.BAD_REQUEST
        );
      }
      users.push(userId);

      let chat = await repository.accessChat(userId, users);

      if(!chat){
       const newChat = await repository.groupchatCreate(userId,name,users);
    
    
        if (newChat && newChat._id) {
            chat = await repository.getFullChat(newChat._id);
        }
    }
  
    return chat;
  };

 