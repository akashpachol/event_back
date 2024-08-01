import express from "express";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
import { chatController } from "../../../adapters/controllers/chat/chatController";
import { chatRepositoryMongoDB } from "../../database/mongodb/repositories/chatRepositoryMongoDB";
export const chatRouter = () => {
  const router = express.Router();
  const controller = chatController(chatRepositoryMongoDB);

  router.post("/", controller.accessChat);
  router.post("/group" , controller.createGroupChat);
  router.get("/allChats/:userId", controller.fetchChats);

  return router;
};
