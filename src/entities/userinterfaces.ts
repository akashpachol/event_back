import { Types } from "mongoose"
export interface UserInterface {
  
    email: string;
    username: string;
    password: string;
    phone?: string | null;
    isBlocked?: boolean;
    isGoogle?:boolean;
    role:string

}

export interface CreateUserInterface {
    _id?: Types.ObjectId |undefined,
    email: string;
    username: string;
    password: string;
    phone?: string | null;
    isBlocked?: boolean;
    isGoogle?:boolean;
    role?:string
}

