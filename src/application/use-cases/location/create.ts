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



export const Filteredlocation = async (
  locationData:any,
  repository: ReturnType<locationRepositoryMongoDBType>
) => {
  if (!locationData) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  const data = repository.getFilterLocationbyIdDb(locationData);

  return data;
};








  
  

  