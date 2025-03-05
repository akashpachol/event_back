import express from "express";
import { managerController } from "../../../adapters/controllers/manager/managerController";
import { bookingRepositoryMongoDB } from "../../database/mongodb/repositories/bookingRepositoryMongoDB";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
import { userRepositoryMongoDB } from "../../database/mongodb/repositories/userRepositoryMongoDB";
export const  managerRouter=()=>{
    const router = express.Router();
    const controller=managerController(bookingRepositoryMongoDB,userRepositoryMongoDB)



    router.get('/getUserBooking/:managerId',jwtTokenVerification, controller.getUserBooking);
    router.get('/getUserbookingDetails/:bookigId',jwtTokenVerification, controller.getUserbookingDetails);
    router.get('/getAllManager',jwtTokenVerification, controller.getAllManager);
    router.get('/getAllRoleData/:id',jwtTokenVerification, controller.getAllRoleData);

    return router
}