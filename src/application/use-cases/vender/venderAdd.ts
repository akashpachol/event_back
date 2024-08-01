
import { venderInterface } from "../../../entities/venderInterface";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
export  const venderAdd=async (venderData:venderInterface,
repository:ReturnType<venderRepositoryMongoDBType>)=>{
  
    const {vender,name,address,description,image,type,price,state}=venderData
    if (
        !name ||
        !address ||
        !vender||
        !description ||
        !image ||
        !type||
        !price||
        !state 
      ) {
        throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
      }
    

      return await repository.createVenderDb(venderData)
}

export  const VenderWithIdGet=async (  venderId: string,
  repository:ReturnType<venderRepositoryMongoDBType>,dbRepositoryUser: ReturnType<UserRepositoryMongoDBType>,)=>{
if(!venderId){
  throw new AppError('Somthing went wrong ', HttpStatus.UNAUTHORIZED)
}
const vender = await dbRepositoryUser.getUserById(venderId);

if(!vender?.isBlocked){
  const data = repository.getVenderbyVenderIdDb(venderId);
console.log(data,"data")
  return data;
}else{

  throw new AppError('Somthing went wrong ', HttpStatus.UNAUTHORIZED)

}


  }

  export  const venderEdit=async (venderId:string,venderData:venderInterface,
    repository:ReturnType<venderRepositoryMongoDBType>)=>{
      


      if(!venderId){

        throw new AppError("vender dose not exist", HttpStatus.NOT_FOUND)
    }
        const {vender,name,address,description,image,type,price,state}=venderData
        if (
            !name ||
            !address ||
            !vender||
            !description ||
            !image ||
            !type||
            !price||
            !state 
          ) {
            throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
          }
          return await repository.updateVenderdb(venderId,venderData)
    }
    
