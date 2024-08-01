import { venderTypeInterface } from "../../../entities/venderTypeInterface";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
export const venderTypeAdd = async (
  vender: {
    name:string;
    description:string;
    image:string;
  },
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!vender.name || !vender.description || !vender.image) {
    throw new AppError("Fill All informations", HttpStatus.BAD_REQUEST);
  }

  return await repository.createVenderTypeDb(vender);
};
export  const VenderTypeGet=async (
  repository:ReturnType<venderRepositoryMongoDBType>)=>{
    const getEvent = await repository.getVenderTypeDb();

    return getEvent;
  }
  export const VenderTypeBlock =async ( vendertypeid: string,  repository:ReturnType<venderRepositoryMongoDBType>) => {
    if(!vendertypeid){
      throw new AppError('Somthing went wrong please log in again', HttpStatus.UNAUTHORIZED)
  }
  const event  = await repository.getVenderTypebyIdDb(vendertypeid);
  
  if(!event){
      throw new AppError('User Dose not exist', HttpStatus.UNAUTHORIZED)
  }
  if(!event.isBlocked){
    let updates={isBlocked:true}
    const event = await repository.updateVenderTypeByPropertydb(vendertypeid, updates);

    
    return {event,message:'Vender Type blocked succesfully'}
  }else{
    let updates={isBlocked:false}
    const event = await repository.updateVenderTypeByPropertydb(vendertypeid, updates);
    
    return {event,message:'Vender Type Unblocked succesfully'}
  }
  }

  export  const venderTypeEdit=async (venderId:string,venderTypeData:venderTypeInterface,
    repository:ReturnType<venderRepositoryMongoDBType>)=>{
      if(!venderId){
        throw new AppError("vender dose not exist", HttpStatus.NOT_FOUND)
    }
        const {name,description,image}=venderTypeData
        if (
            !name ||
            !description ||
            !image 
          ) {
            throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
          }
          return await repository.updateVenderTypedb(venderId,venderTypeData)
    }