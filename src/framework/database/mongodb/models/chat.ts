import mongoose, { Document, Schema, Model } from "mongoose";

interface chatDocument extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Schema.Types.ObjectId[];
  messages?: mongoose.Schema.Types.ObjectId[];
  groupAdmin?: mongoose.Schema.Types.ObjectId;  
}

const chatSchema: Schema<chatDocument> = new Schema(
  {
    chatName: { type:String,	default:''},

    isGroupChat: { type: Boolean, default: false },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message", 
				default: [],
			},
		],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat: Model<chatDocument> = mongoose.model<chatDocument>("Chat", chatSchema);

export default Chat;
