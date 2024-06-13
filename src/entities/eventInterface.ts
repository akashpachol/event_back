import { Types } from "mongoose";

export interface EventInterface {
    name: string ;
    description: string  ;
    image: string  ;
  }
  export interface CreateEventInterface {
    _id?: Types.ObjectId |undefined,
    name: string ;
    description: string  ;
    image: string  ;
}