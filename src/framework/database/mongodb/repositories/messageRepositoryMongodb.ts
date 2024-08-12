import mongoose from "mongoose";
import Chat from "../models/chat";
import Message from "../models/message";



export const messageRepositoryMongoDB = () => {
  const messageGet = async (userId: string, chatId: string) => {
    const userObjectId = new mongoose.Types.ObjectId(userId.trim());
    const chatIdObj = new mongoose.Types.ObjectId(chatId.trim());


  const messages = await Message.find(
            {
              chatId:chatIdObj,
            isDeleted: {$ne:true},
        
          })
            .populate(
              "sender",
              "-password  -refreshToken -refreshTokenExpiresAt "
            )
            .populate("chatId")


            
          return messages;
    
  };



  const messageSend = async (
    chatId: string,
    content: string,
    userId: string
  ) => {
    const newMessage = new Message({
      sender: userId,
      chatId: chatId,
      content,
      readBy:userId
    });
    try {
      const message = await Message.create(newMessage);
      return message;
    } catch (error) {
      console.log("error in creating new message ", error);
    }

  };




  const getFullMessage=async(messageId:string)=>{
    try {
      
        const messageIdObject = new mongoose.Types.ObjectId(messageId);
        const fullMessage=await Message.findById(messageIdObject)
        .populate(
            "sender",
            "-password  -refreshToken -refreshTokenExpiresAt "
          )
          .populate("chatId")
          .populate(
            "chatId.users",
            "-password  -refreshToken -refreshTokenExpiresAt "
          );

          
          //@ts-ignore
          const recieverId = fullMessage?.chatId?.users?.find(item => item.toString() !== fullMessage.sender._id.toString());


     
          return fullMessage

    } catch (error) {
        console.log('error in getting full message',error)
    }
}


const getAllMessagesFromChat = async (chatId: string,userId:string) => {
  try {
      let chatIdObj = new mongoose.Types.ObjectId(chatId)
    const messages = await Message.find(
      {
        chatId:chatIdObj,
      isDeleted: {$ne:true},
      deletedBy: { $ne: userId }
    })
      .populate(
        "senderId",
        "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
      )
      .populate("chatId")

    return messages;
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting messages");
  }
};

const getUnreadMessagesFromChat=async(chatId:string,userId:string)=>{
  try {
    let chatIdObj = new mongoose.Types.ObjectId(chatId)
    const messages = await Message.find({chatId:chatIdObj,isSeen:false,sender:{$ne:userId}})
      .populate(
        "sender",
        "-password --refreshToken -refreshTokenExpiresAt "
      )
      .populate("chatId")

    return messages;
  } catch (error) {
    console.log(error)
    throw new Error('Error in getting all unread messages')
  }
}

const getAllUnreadMessages=async(userId:string)=>{
  try {
    const chatIds = await Chat.find(
      { members: { $in: [userId] } },
      {_id: 1 } 
    );
    //@ts-ignore
    const chatIdArray = chatIds.map((chat) => chat?._id);
    const messages = await Message.find({ chatId: { $in: chatIdArray },senderId:{$ne:userId },isSeen:false});
    return messages
  } catch (error) {
    console.log(error)
    throw new Error('Error in getting all unread messages')
  }
}

const setUnreadMessagesRead=async(chatId:string,userId:string)=>{
  try {
     let chatIdObj=new mongoose.Types.ObjectId(chatId)
     await Message.updateMany({chatId:chatIdObj,isSeen:false,senderId:{$ne:userId}},{isSeen:true})
  } catch (error) {
    console.log(error)
    throw new Error('Error in setting unread messages read.')
  }
}






const updateMessagedb = async (id: string, userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId.trim());
  const chatIdObj = new mongoose.Types.ObjectId(id.trim());
  const message = await Message.updateMany(
    { chatId: chatIdObj },
    { $addToSet: {readBy:userObjectId} }
  );
  return message;
};
const deleteMessagedb = async ( messageId: string,data:any) => {
  const messageObjectId = new mongoose.Types.ObjectId(messageId.trim());

  const message = await Message.findByIdAndUpdate(
    messageObjectId,
    { $set:  data  },
    { new: true }  
  );

  
  return message;
};


  return {
    messageGet,
    messageSend,
    getFullMessage,
    getAllMessagesFromChat,
    setUnreadMessagesRead,
    getAllUnreadMessages,
    getUnreadMessagesFromChat,
    updateMessagedb,
    deleteMessagedb
  };
};

export type messageRepositoryMongoDBType = typeof messageRepositoryMongoDB;
