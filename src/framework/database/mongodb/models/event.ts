import { Schema, model } from "mongoose";

export interface EventDocument extends Document {
  name: string;
  description: string;
  image: string | null;
  isBlocked:Boolean
}
const eventSchema: Schema<EventDocument> = new Schema(
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

const Event = model("event", eventSchema);

export default Event;
