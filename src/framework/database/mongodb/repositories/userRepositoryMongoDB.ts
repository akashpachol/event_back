import User from "../models/user";
import { CreateUserInterface } from "../../../../types/userinterfaces";
import { UserEntityType } from "../../../../entities/user";
import bcrypt from 'bcrypt'

export const userRepositoryMongoDB = () => {
    const getUserByEmail = async (email: string) => {
      const user: CreateUserInterface | null = await User.findOne({ email });

      
      return user;
    };
  

  
    const addUser = async (user: UserEntityType) => {
      const newUser: any = new User({
        username: user.username,
   
        email: user.email,
         
        password: user.password,
      });
      newUser.save();
    
      
      return newUser;
    };
  
    const addGoogleUser = async (user: UserEntityType) => {
   
      
      const existingUser:any = await getUserByEmail(user.email)

      if (existingUser) {
      
        
                 if (existingUser.isGoogle) {
                    let user = {
                         _id: existingUser._id,
                         email: existingUser.email,
                         username: existingUser.username,
                     }
                   
                     
                     return user
                 } else {
                    throw new Error("user already exists with this email.");
                 }
           }
           const randomPassword = Math.random().toString(36).slice(-8)
           const hashedPassword = await bcrypt.hash(randomPassword, 10)
      const newUser: any = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        isGoogle:true,
      });
      newUser.save();
    
      
      return newUser;
    };

    const getUserById = async (id: string) => await User.findById(id);
  
    const updateUserByProperty = async (id: string, updates: any) => {
      const user: CreateUserInterface | null = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );
      return user;
    };

    const changeProfileImg = async (id: string, url: string) =>
      await User.findByIdAndUpdate(
        id,
        { $set: { image: url } },
        { upsert: true, new: true }
      );
  
    return {
      getUserByEmail,
      addUser,
      addGoogleUser,
      getUserById,
      updateUserByProperty,
      changeProfileImg
    };
  };
  
  export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
