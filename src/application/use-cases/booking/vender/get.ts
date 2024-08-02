import {
    bookingInterface,
    bookingVenderInterface,
  } from "../../../../entities/bookingInterface";
  
  import { bookingRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
  
  import { venderRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
  import { HttpStatus } from "../../../../types/httpStatus";
  import AppError from "../../../../utils/appError";

  

  
export const getVenderBookingHistory = async (
  userId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!userId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const data = { user: userId };
    const booking = await bookingrepository.getBookingHistory(data);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};