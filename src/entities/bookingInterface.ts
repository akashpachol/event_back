
import { Types } from "mongoose";
import { CreateUserInterface } from "./userinterfaces";
import { CreateLocationInterface } from "./locationInterface";
import { CreateVenderInterface } from "./venderInterface";
export interface bookingInterface  {
  user:string;
    manager:string;
    locationData:string ;
    name: string;
    event:string;
    phone:string;
    service:{ data: string, status: string }[],
    total:number;
    date:string;
    time:string;
    count:string;
    status:string;
  }
  
  export interface createbookingInterface {
    _id?: Types.ObjectId |undefined,
    manager:Types.ObjectId|CreateUserInterface;
    locationData:Types.ObjectId;
    name: string;
    event:string;
    status:string;

    service:string[];
    total:number;
    date:string;
    time:string;
    count:string;
  }

  export interface getService{
    
      data:CreateVenderInterface;
      status:string,
      _id?:string
    
  }


  export interface getbookingInterface {
    _id?: Types.ObjectId |undefined,
    manager:CreateUserInterface;
    locationData:CreateLocationInterface;
    user:CreateUserInterface,
    name: string;
    event:string;
    status:string;

    service:[];
    total:number;
    date:string;
    time:string;
    count:string;
  }


  export interface bookingVenderInterface  {
    vender:string;
      manager:string;
      venderData:string ;
      name: string;
      event:string;
      total:number;
      date:string;
      count:string;
      status:string;
      bookingData?:string
    }
    