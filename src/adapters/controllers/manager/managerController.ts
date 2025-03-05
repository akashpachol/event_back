import { Request, Response } from "express";

import { bookingRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";

import { HttpStatus } from "../../../types/httpStatus";
import expressAsyncHandler from "express-async-handler";
import { getBookingDetail, getUserBookingHistory } from "../../../application/use-cases/booking/event/get";
import { allManagerGet, allRoleDataGet } from "../../../application/use-cases/user/userDetails";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";


export const managerController = (

  bookingRepoimpl: bookingRepositoryMongoDBType,
  userRepoimpl: UserRepositoryMongoDBType
) => {
  const repository = bookingRepoimpl();
  const userRepository = userRepoimpl();

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

  const getAllManager = expressAsyncHandler(
    async (req: Request, res: Response) => {
  

      const manager  = await allManagerGet( userRepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: manager,
      });
    }
  );

  const getAllRoleData = expressAsyncHandler(
    async (req: Request, res: Response) => {
  
      const { id } = req.params;
      const manager  = await allRoleDataGet(id, userRepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: manager,
      });
    }
  );

  return {
    getUserBooking,
    getUserbookingDetails,
    getAllManager,
    getAllRoleData
  };
};
