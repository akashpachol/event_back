import express from "express";
import { managerController } from "../../../adapters/controllers/manager/managerController";
import { bookingRepositoryMongoDB } from "../../database/mongodb/repositories/bookingRepositoryMongoDB";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
export const  managerRouter=()=>{
    const router = express.Router();
    const controller=managerController(bookingRepositoryMongoDB)



    router.get('/getUserBooking/:managerId',jwtTokenVerification, controller.getUserBooking);
    router.get('/getUserbookingDetails/:bookigId',jwtTokenVerification, controller.getUserbookingDetails);

    return router
}