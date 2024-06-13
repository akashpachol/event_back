import { Types } from "mongoose";

export interface LocationInterface {
    manager:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image?:object;
    capasity:number;
    price:number;
    state:string;
    type:string;
    verify?:boolean
  }
  export interface CreateLocationInterface {
    _id?: Types.ObjectId |undefined,
    manager:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image?:object;
    capasity:number;
    price:number;
    state:string;
    verify?:boolean
}