
import { venderInterface } from "../../../entities/venderInterface";
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
  repository:ReturnType<venderRepositoryMongoDBType>)=>{
if(!venderId){
  throw new AppError('Somthing went wrong ', HttpStatus.UNAUTHORIZED)
}

    const data = repository.getVenderbyVenderIdDb(venderId);

    return data;
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
    
