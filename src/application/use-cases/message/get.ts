import { messageRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/messageRepositoryMongodb";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const getMessages = async (
  userId: string,
  chatId: string,
  repository: ReturnType<messageRepositoryMongoDBType>
) => {
  if (!userId || !chatId) {
    throw new AppError(
      "chatId param not sent with request",
      HttpStatus.BAD_REQUEST
    );
  }
        const updateMessage=await repository.updateMessagedb(chatId,userId)
  const messsage = await repository.messageGet(userId, chatId);

  return messsage;
};





export const handleGetUnreadMessagesFromChat = async (
  chatId: string,
  userId: string,
  messageDbRepository: ReturnType<messageRepositoryMongoDBType>
) => {
  if (!chatId) {
    throw new AppError("Invalid chatId", HttpStatus.UNAUTHORIZED);
  }
  try {
    return await messageDbRepository.getUnreadMessagesFromChat(chatId, userId);
  } catch (error) {
    console.log("error in get unread messages from chat ", error);
    throw new AppError(
      "Error in getting unread messages from chat ",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const handleGetAllUnreadMessages = async (
  userId: string,
  messageDbRepository: ReturnType<messageRepositoryMongoDBType>
) => {
  try {
    return await messageDbRepository.getAllUnreadMessages(userId);
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Error in fetching all unread messages",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
