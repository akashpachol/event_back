import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  bookingInterface,
  bookingVenderInterface,
} from "../../../entities/bookingInterface";
import { HttpStatus } from "../../../types/httpStatus";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";

import { bookingRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { walletRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/walletRepositoryMongoDB";

import { bookEvent, capturepayment, payment } from "../../../application/use-cases/booking/event/create";
import { bookingEvent, checkBookingCount, checkManagerbookingCount, getBookingDetail, getBookingHistory, locationBookingDetails, VenderAvailabilityCheck } from "../../../application/use-cases/booking/event/get";
import { cancelBooking, checkStatus } from "../../../application/use-cases/booking/event/edit";
import { bookVenderService, venderCapturepayment } from "../../../application/use-cases/booking/vender/create";
import { getMangerBookingDetail, getMangerBookingHistory, getVenderBookingHistory, venderBookingDetails } from "../../../application/use-cases/booking/vender/get";
import { NotificationRepositoryMongoDbType } from "../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";

export const bookingController = (
  venderRepoimpl: venderRepositoryMongoDBType,
  locationRepoimpl: locationRepositoryMongoDBType,
  bookingRepoimpl: bookingRepositoryMongoDBType,
  userRepoimpl: UserRepositoryMongoDBType,
  walletRepoimpl: walletRepositoryMongoDBType,
  notificationRepoimpl:NotificationRepositoryMongoDbType,

) => {
  const locationrepository = locationRepoimpl();
  const venderrepository = venderRepoimpl();
  const bookingrepository = bookingRepoimpl();
  const usergrepository = userRepoimpl();
  const walletrepository = walletRepoimpl();
  const  notificationrepository = notificationRepoimpl();

  let bookingData: bookingInterface | null = null;
  let venderServiceData: bookingVenderInterface | null = null;
  const bookLocation = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const booking: bookingInterface = req.body;
      const data = await bookEvent(
        booking,
        locationrepository,
        venderrepository,bookingrepository
      );
      bookingData = data;

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "event booked successfully",
        data,
      });
    }
  );

  const paymentBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      if (!bookingData) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "failure",
          message: "No booking data available",
        });
        return;
      }

      const { order } = await payment(bookingData
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "event booked successfully",
        data: order,
        amount: bookingData.total,
      });
    }
  );

  const paymentcapture = expressAsyncHandler(
    async (req: Request, res: Response) => {
      if (!bookingData) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "failure",
          message: "No booking data available",
        });
        return;
      }
      const { paymentId } = req.params;
      const { amount } = req.body;

      const { order, service } = await capturepayment(
        bookingData,
        paymentId,
        amount,
        bookingrepository,
        usergrepository,
        notificationrepository
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "event booked successfully",
        data: order,
        service,
      });
    }
  );

  const bookingHistory = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;

      const { booking } = await getBookingHistory(userId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking history",
        data: booking,
      });
    }
  );

  const bookingDetails = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { bookigId } = req.params;

      const { booking } = await getBookingDetail(bookigId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );

  const checkAvailability = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { date, locationData } = req.body;

      const { data } = await checkStatus(date, locationData, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "available slot",
        data,
      });
    }
  );

  const bookingCancel = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { reason, id } = req.body;

      await cancelBooking(reason, id, bookingrepository, walletrepository,notificationrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "cancel booking",
      });
    }
  );

  const bookService = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const venderService: bookingVenderInterface = req.body;
      const data = await bookVenderService(venderService, venderrepository);
      venderServiceData = { ...data, bookingData: venderService.bookingData };

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "service booked successfully",
        data,
      });
    }
  );

  const venderPaymentcapture = expressAsyncHandler(
    async (req: Request, res: Response) => {
      if (!venderServiceData) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "failure",
          message: "No booking data available",
        });
        return;
      }
      const { paymentId } = req.params;
      const { amount } = req.body;

      const { order, service } = await venderCapturepayment(
        venderServiceData,
        paymentId,
        amount,
        bookingrepository,notificationrepository
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "service booked successfully",
        data: order,
        service,
      });
    }
  );

  const bookingVenderHistory = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;

      const { booking } = await getVenderBookingHistory(userId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking history",
        data: booking,
      });
    }
  );


  const getMangerBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { venderId } = req.params;

      const { booking } = await getMangerBookingHistory(venderId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "all booking history",
        data: booking,
      });
    }
  );
  const getMangerbookingDetails = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { bookigId } = req.params;

      const { booking } = await getMangerBookingDetail(bookigId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );

  const getLocationBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { locationId } = req.params;

      const { booking } = await locationBookingDetails(locationId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );
  const getVenderBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { venderId } = req.params;

      const { booking } = await venderBookingDetails(venderId, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );


  const checkVenderAvailability = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { date } = req.params;

      const { booking } = await VenderAvailabilityCheck(date, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );

  const bookingCount = expressAsyncHandler(
    async (req: Request, res: Response) => {
      let { year } = req.params;
const yearValue=Number(year)
      const { booking } = await checkBookingCount(yearValue, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );

  const ManagerbookingCount = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const id=req.query.id as string

      const year=req.query.year as string
const yearValue=Number(year)
      const { booking } = await checkManagerbookingCount(yearValue,id, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );
  const eventBooking = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const id=req.query.id as string



      const { booking } = await bookingEvent(id, bookingrepository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "get Booking Details",
        data: booking,
      });
    }
  );


  return {
    bookLocation,
    paymentBooking,
    paymentcapture,
    bookingHistory,
    bookingDetails,
    checkAvailability,
    bookingCancel,
    bookService,
    venderPaymentcapture,
    bookingVenderHistory,
    getMangerBooking,
    getMangerbookingDetails,
    getLocationBooking,
    getVenderBooking,
    checkVenderAvailability,
    bookingCount,
    ManagerbookingCount,
    eventBooking
  };
};
