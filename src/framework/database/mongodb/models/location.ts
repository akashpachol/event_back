import  mongoose, { Schema,Types,model } from "mongoose";

export interface LocationDocument extends Document {
    manager:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image:object;
    capasity:number;
    price:number;
    state:string;
    verify:Boolean;
    isBlocked:Boolean;
    type:Types.ObjectId;

  }


  
const locationSchema:Schema<LocationDocument>= new Schema(
  {
    manager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    type:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event',
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
    capasity:{
        type:Number,

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
    },
    isBlocked:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Location = model("location", locationSchema);

export default Location;