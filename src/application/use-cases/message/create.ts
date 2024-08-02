import { chatRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/chatRepositoryMongoDB";
import { messageRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/messageRepositoryMongodb";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const messageSend = async (
  content: string,
  chatId: string,
  userId: string,
  repository: ReturnType<messageRepositoryMongoDBType>,
  chatDbRepository: ReturnType<chatRepositoryMongoDBType>
) => {
  if (!chatId || !content || !userId) {
    throw new AppError(
      "Invalid data passed into request",
      HttpStatus.BAD_REQUEST
    );
  }

  const createdMessage = await repository.messageSend(chatId, content, userId);

  const fullMessage = await repository.getFullMessage(createdMessage?._id);

  fullMessage &&
    fullMessage._id &&
    (await chatDbRepository.setLatestMessage(chatId, fullMessage?._id));
  return fullMessage;
};

export const handleSetUnreadMessagesRead = async (
  chatId: string,
  userId: string,
  messageDbRepository: ReturnType<messageRepositoryMongoDBType>
) => {
  if (!chatId) {
    throw new AppError("Invalid chatId", HttpStatus.UNAUTHORIZED);
  }
  try {
    return await messageDbRepository.setUnreadMessagesRead(chatId, userId);
  } catch (error) {
    console.log("error in setting unread messages read ", error);
    throw new AppError(
      "Error in setting unread messages read ",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
