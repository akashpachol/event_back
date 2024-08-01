import { LocationInterface } from "../../../entities/locationInterface";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
export const locationAdd = async (
  location: LocationInterface,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {
  const {
    manager,
    address,
    name,
    description,
    image,
    capasity,
    price,
    type,
    state,
  } = location;

  if (
    !name ||
    !address ||
    !manager ||
    !description ||
    !image ||
    !capasity ||
    !price ||
    !state ||
    !type
  ) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }


  const data = await repository.createLocationDb(location);
  
  return true;
};

export const LocationWithIdGet = async (
  managerId: string,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {
  if (!managerId) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  const data = repository.getLocationbyManagerIdDb(managerId);

  return data;
};
export const LocationDetails = async (
  location_id: string,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {
  
  if (!location_id) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  const data = repository.getLocationbyIdDb(location_id);

  return data;
};


export const locationEdit = async (

  location: LocationInterface,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {

  const {
    
    manager,
    address,
    name,
    description,
    image,
    capasity,
    price,
    type,
    state,
  } = location;

  const id=location.id
  
  if(!id){

    throw new AppError("vender dose not exist", HttpStatus.NOT_FOUND)
  }

  if (
    !name ||
    !address ||
    !manager ||
    !description ||
    !image ||
    !capasity ||
    !price ||
    !state ||
    !type
  ) {

    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  return await repository.verifyLocationDb(id,location)
}
