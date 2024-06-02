import express from "express";
import adminController from "../../../adapters/controllers/admin/adminController";
import { userDbRepository } from "../../../application/repositories/userDbRepository";
import { userRepositoryMongoDB } from "../../database/mongodb/repositories/userRepositoryMongoDB";


export default function adminRoute() {
  const router = express.Router();

  const controller = adminController(
    userDbRepository,
    userRepositoryMongoDB,

  );



  router.route("/users").get(controller.handleGetAllUsers);

  router.get("/user/:userId", controller.handleBlockUsers);

  return router;
}
