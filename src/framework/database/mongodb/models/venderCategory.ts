import  { Schema,model } from "mongoose";

export interface VenderTypeDocument extends Document {
    name: string;
    description: string;
    image: string | null;
    isBlocked:Boolean
  }
const venterTypeSchema: Schema<VenderTypeDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isBlocked:{
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const VenderType = model("VenderType", venterTypeSchema);

export default VenderType;