import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";

import AppError from "../../../utils/appError";





export  function removePasswordField(object: any){
    let { _id, username, email, phone,image, createdAt,isBlocked, updatedAt} = object

    createdAt = new Date(createdAt).toLocaleString().split(",")[0];

    updatedAt = new Date(updatedAt).toLocaleString().split(",")[0]

    return { _id, username, email, phone,image, createdAt, updatedAt,isBlocked}

}

export const getUserProfile = async (
   
    userId:string,
    userRepository: ReturnType<UserRepositoryMongoDB>,
          
  ) => {
    
    if(!userId){
        throw new AppError('Somthing went wrong please log in again', HttpStatus.UNAUTHORIZED)
    }
    const user  = await userRepository.getUserById(userId);
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
    userRepository: ReturnType<UserRepositoryMongoDB>
  ) => {
    if (!updates) {
      throw new AppError(
        "please provide something to update",
        HttpStatus.NOT_FOUND
      );
    }
  
    const user = await userRepository.updateUserByProperty(id, updates);
    const data = removePasswordField(user);
  
    if (!data) {
      throw new AppError("User Dose not exist", HttpStatus.UNAUTHORIZED);
    }
  
    return data;
  };

  export const updateProfileImg = async (id:string, url: string, repository:ReturnType<UserRepositoryMongoDB>) =>{

    if(!id || !url){
      throw new AppError("Somthing went wrong", HttpStatus.BAD_REQUEST);
    }
  
    return await repository.changeProfileImg(id, url);
  
  }


  export const getAllUsers =async ( userRepository : ReturnType<UserRepositoryMongoDB>,value:object) => {
    const users = await userRepository.getAllUsers(value)

    const data =  users.map( user => removePasswordField(user))
    
    return data
}

export const blockuser =async (    userId: string, userRepository : ReturnType<UserRepositoryMongoDB>) => {



  if(!userId){
    throw new AppError('Somthing went wrong please log in again', HttpStatus.UNAUTHORIZED)
}
const user  = await userRepository.getUserById(userId);

if(!user){
    throw new AppError('User Dose not exist', HttpStatus.UNAUTHORIZED)
}


if(!user.isBlocked){
  let updates={isBlocked:true}
  const user = await userRepository.updateUserByProperty(userId, updates);
  let data= removePasswordField(user)
  
  
  return {data,message:'user blocked succesfully'}
}else{
  let updates={isBlocked:false}
  const user = await userRepository.updateUserByProperty(userId, updates);

  
  let data= removePasswordField(user)
  console.log(data,"kkkkkkkkkdsdsds");

  return {data,message:'user Unblocked succesfully'}
}
}
  


     