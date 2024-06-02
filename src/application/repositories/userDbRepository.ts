import { UserEntityType } from "../../entities/user";
import { UserRepositoryMongoDB } from "../../framework/database/mongodb/repositories/userRepositoryMongoDB";





export const userDbRepository = (
  repository: ReturnType<UserRepositoryMongoDB>
) => {

  
  const getUserByEmailValue = async (email: string) =>
    await repository.getUserByEmail(email);

  const addUserValue = async (user:UserEntityType) =>
    await repository.addUser(user);
  const addGoogleUserValue = async (user:UserEntityType) =>{

    
   return  await repository.addGoogleUser(user);
  }
  

  const getUserByIdValue = async (id: string) => await repository.getUserById(id)
  const updateUserByPropertyValue =async (id:string, update: object) => await repository.updateUserByProperty(id, update)
  const changeProfileImgValue = async (id:string, url: string) => await repository.changeProfileImg(id, url);

  return {
    getUserByEmailValue,
    addUserValue,
    getUserByIdValue,
    updateUserByPropertyValue,
    addGoogleUserValue,
    changeProfileImgValue
  };
};

export type UserDbInterface = typeof userDbRepository;
