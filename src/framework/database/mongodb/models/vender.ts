import  mongoose, { Schema,Types,model } from "mongoose";
import { UserDocument } from "./user";

export interface VenterDocument extends Document {
    vender:Types.ObjectId| UserDocument;
    type:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image:object;
    price:number;
    state:string;
    verify:Boolean;
    status:string;
  }
const VenderSchema:Schema<VenterDocument>= new Schema(
  {
    vender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VenderType',
      required: true
    },
     name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
        type: [String],
    },
    address:{
        type: String,
        require: true,
    },
    status:{
      type: String,
      require: true,
      default:'pending'
  },

    price:{
       type:Number,
    },
    state:{
   type:String
    },
    verify:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
const Vender = model("vender", VenderSchema);

export default Vender;