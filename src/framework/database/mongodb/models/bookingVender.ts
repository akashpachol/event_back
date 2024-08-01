import  mongoose, { Schema,Types,model } from "mongoose";

export interface bookingDocument extends Document {
    manager:Types.ObjectId;
    vender:Types.ObjectId;
    venderData:Types.ObjectId;
    name: string;
    event:string;
    status:string;
  
    total:number;
    date:string;

 
    count:string;
  }

const bookingVenderSchema:Schema<bookingDocument>= new Schema(
  {
    vender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    manager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
     name: {
      type: String,
      required: true,
    },

    event:{
        type: String,
        required: true,  
    },

    status:{
        type:String,
        required: true, 
    },
 
    venderData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender',
        required: true
    },
    total:{
        type:Number,
        required: true, 
    },
    date:{
        type:String,
        required: true, 
    },
 
  
  
    count:{
        type:String,
        required: true,  
    }
  },
  {
    timestamps: true,
  }
);
const BookingVender = model("bookingVender", bookingVenderSchema);

export default BookingVender;