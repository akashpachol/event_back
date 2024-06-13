import { Types } from "mongoose";

export interface venderTypeInterface {
    name: string;
    description: string;
    image: string;
  }
  export interface CreateVenderTypeInterface {
    _id?: Types.ObjectId |undefined,
    name: string ;
    description: string  ;
    image: string  ;
}