import express from "express";

import jwtTokenVerification from "../middleware/jwtTokenVerification";
import { bookingController } from "../../../adapters/controllers/booking/bookingController";
import { venderRepositoryMongoDB } from "../../database/mongodb/repositories/venterRepositoryMongoDB";
import { locationRepositoryMongoDB } from "../../database/mongodb/repositories/locationRepositoryMongoDB";
import { bookingRepositoryMongoDB } from "../../database/mongodb/repositories/bookingRepositoryMongoDB";
import { userRepositoryMongoDB } from "../../database/mongodb/repositories/userRepositoryMongoDB";
import { walletRepositoryMongoDB } from "../../database/mongodb/repositories/walletRepositoryMongoDB";
export const bookingRouter = () => {
  const router = express.Router();
  const controller = bookingController(
    venderRepositoryMongoDB,
    locationRepositoryMongoDB,
    bookingRepositoryMongoDB,
    userRepositoryMongoDB,
    walletRepositoryMongoDB

  );

  router.post("/bookLocation", jwtTokenVerification, controller.bookLocation);
  router.post(
    "/paymentBooking",
    jwtTokenVerification,
    controller.paymentBooking
  );
  router.post(
    "/paymentcapture/:paymentId",
    jwtTokenVerification,
    controller.paymentcapture
  );

  router.get(
    "/bookingDetails/:bookigId",
    jwtTokenVerification,
    controller.bookingDetails
  );
  router.get(
    "/bookingHistory/:userId",
    jwtTokenVerification,
    controller.bookingHistory
  );

  router.post(
    "/checkAvailability",
    jwtTokenVerification,
    controller.checkAvailability
  );
  router.post(
    "/bookingCancel",
    jwtTokenVerification,
    controller.bookingCancel
  );

  router.post("/bookService", jwtTokenVerification, controller.bookService);

  router.post(
    "/venderPaymentcapture/:paymentId",
    controller.venderPaymentcapture
  );


  router.get(
    "/bookingVenderHistory/:userId",
    jwtTokenVerification,
    controller.bookingVenderHistory
  );

  return router;
};
