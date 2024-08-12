import mongoose, { Document, Schema, Model } from "mongoose";

interface MessageDocument extends Document {
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
 
  readBy: mongoose.Schema.Types.ObjectId[];
  chatId: mongoose.Schema.Types.ObjectId;
  deletedBy: mongoose.Schema.Types.ObjectId;
  isSeen: boolean;
  isDeleted: boolean;
}

const messageSchema: Schema<MessageDocument> = new Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, trim: true, required: true },
  
    deletedBy: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message: Model<MessageDocument> = mongoose.model<MessageDocument>(
  "Message",
  messageSchema
);

export default Message;
