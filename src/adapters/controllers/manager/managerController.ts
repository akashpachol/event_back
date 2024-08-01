import { Request, Response } from "express";

import { bookingRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";

import { HttpStatus } from "../../../types/httpStatus";
import expressAsyncHandler from "express-async-handler";
import { getBookingDetail, getUserBookingHistory } from "../../../application/use-cases/booking/event/get";


export const managerController = (
  bookingRepoimpl: bookingRepositoryMongoDBType
) => {
  const repository = bookingRepoimpl();

  const getUserBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { managerId } = req.params;

      const { booking } = await getUserBookingHistory(managerId, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "all booking history",
        data: booking,
      });
    }
  );
  const getUserbookingDetails = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { bookigId } = req.params;

      const { booking } = await getBookingDetail(bookigId, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );

  return {
    getUserBooking,
    getUserbookingDetails,
  };
};
