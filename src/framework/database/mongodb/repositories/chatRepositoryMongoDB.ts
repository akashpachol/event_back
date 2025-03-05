import mongoose from "mongoose";
import Chat from "../models/chat";

export const chatRepositoryMongoDB = () => {
  const createChat = async (userId: string, reciverId: string) => {
    try {
      const newChat = new Chat({
        users: [userId, reciverId],
      });
      const chat = await newChat.save();
      return chat;
    } catch (error) {
      console.log("Erron in creating new Chat ", error);
    }
  };

  const groupchatCreate = async (
    userId: string,
    name: string,
    users: string[]
  ) => {
    try {
      const groupChat = await Chat.create({
        chatName: name,
        users,
        isGroupChat: true,
        groupAdmin: userId,
      });

      return groupChat;
    } catch (error) {
      console.log("Erron in creating new Chat ", error);
    }
  };

  const accessChat = async (userId: string, reciverId: string | string[]) => {
    try {
      const loggedInUserObjectId = new mongoose.Types.ObjectId(userId);

      let otherUserObjectIds: mongoose.Types.ObjectId[] = [];

      if (Array.isArray(reciverId)) {
        otherUserObjectIds = reciverId.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
      } else {
        otherUserObjectIds = [new mongoose.Types.ObjectId(reciverId)];
      }

      var isChat: any = await Chat.findOne({
        isGroupChat: false,
        users: {
          $all: [loggedInUserObjectId, ...otherUserObjectIds],
        },
      })
        .populate("users", "-password -refreshToken -refreshTokenExpiresAt")
        .populate("messages");

      return isChat;
    } catch (error) {
      console.error("Error in accessing chat", error);
    }
  };

  const chatGet = async (userId: string) => {
    try {

      const userObjectId = new mongoose.Types.ObjectId(userId);
console.log(userObjectId);

      const chats = await Chat.find({
        users: { $in: [userId] },
      })
        .populate("users", "-password -refreshToken -refreshTokenExpiresAt")
        .populate("messages")
        .sort({ updatedAt: -1 });
    

      return chats;
    } catch (error) {
      console.error("Error in getting chats", error);
      throw new Error("Unable to get chats");
    }
  };

  const getFullChat = async (chatId: string) => {
    try {
      const fullChat = await Chat.findById(chatId)
        .populate("users", "-password  -refreshToken -refreshTokenExpiresAt")
        .populate("messages");
      return fullChat;
    } catch (error) {
      console.log("error in getting full chat", error);
    }
  };

  const setLatestMessage = async (chatId: string, messageId: string) => {
    try {
      const chatObjectId = new mongoose.Types.ObjectId(chatId);

      const chatData = await Chat.findByIdAndUpdate(
        chatObjectId,
        { $set: { messages: messageId } },
        { new: true }
      ).populate("messages");

      return chatData;
    } catch (err) {
      console.log(err);
      throw new Error("Error in setting latest message");
    }
  };

  return {
    accessChat,
    chatGet,
    createChat,
    getFullChat,
    setLatestMessage,
    groupchatCreate,
  };
};

export type chatRepositoryMongoDBType = typeof chatRepositoryMongoDB;
