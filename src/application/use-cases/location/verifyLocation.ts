import { LocationInterface } from "../../../entities/locationInterface";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { walletRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/walletRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";



export const verifyLocation = async (
  locationId: string,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {
  if (!locationId) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }
  const location = await repository.getLocationByIdValueDb(locationId);

  if (!location) {
    throw new AppError("Location does not exist", HttpStatus.UNAUTHORIZED);
  }

  if (!location.verify) {
    let updates = { verify: true };
    const location = await repository.verifyLocationDb(locationId, updates);
    

    return { location, message: "user blocked succesfully" };
  }
};

export const verifyLocationGet=async (  repository: ReturnType<locationRepositoryMongoDBType>)=>{
    let value={verify:true}
        const locations = await repository.getAllVerifyLocationDb(value)
        let checkVenders=locations.filter((value)=>{
            return   value.manager.isBlocked===false
          }) 
        return checkVenders
    }
    export const walletGet=async (userId:string,  repository: ReturnType<walletRepositoryMongoDBType>)=>{
 
      if (!userId) {
        throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
      }

          const data = await repository.getWalletDb(userId)
     console.log(data,"data");
     
          return data
      }


      export const managerGet=async (role:string, userId:string, repository: ReturnType<UserRepositoryMongoDBType>)=>{
 
        if (!role) {
          throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
        }


        let data;
        console.log(role);
        
        if(role=='admin'){
          data = await repository.getAllPerson(role,userId)

        }else{
          data = await repository.getManger(role)

        }
  
       
            return data
        }
