import express from "express";
import { eventController } from "../../../adapters/controllers/event/eventController";
import { eventRepositoryMongoDB } from "../../database/mongodb/repositories/eventRepositoryMongoDB";
export const  eventRouter=()=>{
    const router = express.Router();
    const controller=eventController(eventRepositoryMongoDB)


    router.post('/addeventtype', controller.addEvent);
    router.post('/eventblock', controller.handleBlockEvent);
    router.get('/getevent', controller.getEvent);
    router.get('/editEvent', controller.editEvent);
    return router
}