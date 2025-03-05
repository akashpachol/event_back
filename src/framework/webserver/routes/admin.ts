import express from "express";
import adminController from "../../../adapters/controllers/admin/adminController";
import { userRepositoryMongoDB } from "../../database/mongodb/repositories/userRepositoryMongoDB";



export default function adminRoute() {
  const router = express.Router();

  const controller = adminController(
    userRepositoryMongoDB,


  );



  router.route("/users").get(controller.handleGetAllUsers);
  router.route("/manager").get(controller.handleGetAllManger);
  router.route("/vender").get(controller.handleGetAllVender);

  router.post("/userblock", controller.handleBlockUsers);
  router.route("/getAllData").get(controller.getAllData);
  return router;
}
