import express from "express";
import { eventController } from "../../../adapters/controllers/event/eventController";
import { eventRepositoryMongoDB } from "../../database/mongodb/repositories/eventRepositoryMongoDB";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
export const eventRouter = () => {
  const router = express.Router();
  const controller = eventController(eventRepositoryMongoDB);

  router.post("/addeventtype", jwtTokenVerification, controller.addEvent);
  router.post("/eventblock", jwtTokenVerification, controller.handleBlockEvent);
  router.get("/getevent", controller.getEvent);
  router.get("/editEvent", jwtTokenVerification, controller.editEvent);
  return router;
};
