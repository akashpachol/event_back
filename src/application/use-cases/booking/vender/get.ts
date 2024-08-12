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


export const getMangerBookingDetail = async (
  bookigId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!bookigId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const booking = await bookingrepository.getvenderBookingDetails(bookigId);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};

export const getMangerBookingHistory = async (
  venderId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!venderId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const data = { vender: venderId };
    const booking = await bookingrepository.getvenderBookingHistory(data);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};