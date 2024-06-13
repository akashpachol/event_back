import { LocationInterface } from "../../../entities/locationInterface";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
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
    
        
        return locations
    }


