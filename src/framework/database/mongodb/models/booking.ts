import  mongoose, { Schema,Types,model } from "mongoose";

export interface bookingDocument extends Document {
    manager:Types.ObjectId;
    user:Types.ObjectId;
    locationData:Types.ObjectId;
    name: string;
    event:Types.ObjectId;
    status:string;
    service: { data: Types.ObjectId; status: string }[];
    total:number;
    date:Date;
    time:string;
    phone:string;
    count:string;
  }

const bookingSchema:Schema<bookingDocument>= new Schema(
  {
    user:{
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    phone:{
        type: String,
        required: true,  
    },

    service: [{
        data: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor', 
            required: true,
        },
        status: {
            type: String,
            required: true,
        }
    }],
    locationData:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    total:{
        type:Number,
        required: true, 
    },
    date:{
        type:Date,
        required: true, 
    },
 
    time:{
        type:String,
        required: true, 
    },
    status:{
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
const Booking = model("booking", bookingSchema);

export default Booking;