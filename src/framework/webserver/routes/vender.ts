import express from "express";
import { venderController } from "../../../adapters/controllers/vender/venderController";
import { venderRepositoryMongoDB } from "../../database/mongodb/repositories/venterRepositoryMongoDB";
import { userRepositoryMongoDB } from "../../database/mongodb/repositories/userRepositoryMongoDB";

export const venderRouter = () => {
  const router = express.Router();
  const controller = venderController(
    userRepositoryMongoDB,
    venderRepositoryMongoDB
  );


  router.post("/addvendertype", controller.addVenderType);
  router.post("/vendertypeblock", controller.handleBlockVenderType);
  router.get("/getvendertype", controller.getVenderType);
  router.get("/EditVenderType", controller.EditVenderType);
  router.post('/addVender', controller.addVender);
  router.get('/getvenderwithid/:venderId', controller.getVenderWithId);
  router.get('/getVerifyVenderWithId/:venderId', controller.getVerifyVenderWithId);

  router.post('/verifyvender', controller.venderVerify);
  router.post('/filterVender', controller.filterVender);
  router.get('/getVerifyVender',controller.getVerifyVender)
  router.get('/EditVender',controller.EditVender)
  return router;
};
