

import { bookingRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import { locationRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { UserRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/userRepositoryMongoDB";

import { HttpStatus } from "../../../../types/httpStatus";
import AppError from "../../../../utils/appError";



export const getBookingHistory = async (
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
export const getBookingDetail = async (
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

    const booking = await bookingrepository.getBookingDetails(bookigId);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};

export const getUserBookingHistory = async (
  managerId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!managerId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const data = { manager: managerId };
    const booking = await bookingrepository.getBookingHistory(data);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};



export const locationBookingDetails = async (
  locationId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!locationId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const booking = await bookingrepository.getLocationBookingDetails(locationId);

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};



export const VenderAvailabilityCheck = async (
  date: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!date) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const booking = await bookingrepository.getVenderAvailabilityCheck(date );

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};



export const checkBookingCount = async (
  year: number,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!year) {
 year=new Date().getFullYear()
    }

    const booking = await bookingrepository.getcheckBookingCount(year );

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};


export const checkManagerbookingCount = async (
  year: number,
  id:string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!year) {
 year=new Date().getFullYear()
    }

    const booking = await bookingrepository.getcheckBookingCount(year,id );

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};


export const bookingEvent = async (

  id:string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {


    const booking = await bookingrepository.eventBooking(id );

    return { booking };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};