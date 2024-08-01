import { Types } from "mongoose";

export interface venderInterface {
    vender:Types.ObjectId;
    type:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image:object;
    price:number;
    state:string;
    verify?:Boolean;
  }
  export interface CreateVenderInterface {
    _id?: undefined|string,
    vender:Types.ObjectId;
    type:Types.ObjectId;
    address:string;
    name: string;
    description: string;
    image:object;
    price:number;
    state:string;
    verify?:Boolean;
}