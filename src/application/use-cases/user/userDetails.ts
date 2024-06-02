import { HttpStatus } from "../../../types/httpStatus";

import AppError from "../../../utils/appError";
import { UserDbInterface } from "../../repositories/userDbRepository";
import  { UserEntityType } from "../../../entities/user";




export  function removePasswordField(object: any){
    let { _id, username, email, phone,image, createdAt, updatedAt} = object

    createdAt = new Date(createdAt).toLocaleString().split(",")[0];

    updatedAt = new Date(updatedAt).toLocaleString().split(",")[0]

    return { _id, username, email, phone,image, createdAt, updatedAt,}

}

export const getUserProfile = async (
   
    userId:string,
    userRepository: ReturnType<UserDbInterface>,
          
  ) => {
    
    if(!userId){
        throw new AppError('Somthing went wrong please log in again', HttpStatus.UNAUTHORIZED)
    }
    const user  = await userRepository.getUserByIdValue(userId);
    let data= removePasswordField(user)
    if(!user){
        throw new AppError('User Dose not exist', HttpStatus.UNAUTHORIZED)
    }
      return  data ;
    
  };

  export const updateUserProfile = async (
    id: string,
    updates: {
      username: string;
      email: string;
      phone: string;
 
    },
    userRepository: ReturnType<UserDbInterface>
  ) => {
    if (!updates) {
      throw new AppError(
        "please provide something to update",
        HttpStatus.NOT_FOUND
      );
    }
  
    const user = await userRepository.updateUserByPropertyValue(id, updates);
    // const data = removePasswordField(user);
  
    if (!user) {
      throw new AppError("User Dose not exist", HttpStatus.UNAUTHORIZED);
    }
  
    return user;
  };

  export const updateProfileImg = async (id:string, url: string, repository:ReturnType<UserDbInterface>) =>{

    if(!id || !url){
      throw new AppError("Somthing went wrong", HttpStatus.BAD_REQUEST);
    }
  
    return await repository.changeProfileImgValue(id, url);
  
  }

