
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";








export const verifyVender = async (
    venderId: string,
    repository: ReturnType<venderRepositoryMongoDBType>
  ) => {
    if (!venderId) {
      throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
    }
    const vender = await repository.getVenderByIdDb(venderId);
  
    if (!vender) {
      throw new AppError("vender does not exist", HttpStatus.UNAUTHORIZED);
    }
  
    if (!vender.verify) {
      let updates = { verify: true };
      const vender = await repository.verifyVenderDb(venderId, updates);
      
  
      return { vender, message: "user blocked succesfully" };
    }
  };
  
  export const verifyVenderGet=async (  repository: ReturnType<venderRepositoryMongoDBType>)=>{
  
      let value={verify:true}
  
          const venders = await repository.getAllVerifyVenderDb(value)
      
          
          return venders
      }
  