import express from "express";
import adminAuthController from "../../../adapters/controllers/admin/adminAuthController";
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authServiceInterface } from '../../../application/services/authServiceInterface';
import { userRepositoryMongoDB } from '../../database/mongodb/repositories/userRepositoryMongoDB';
import { authService } from '../../services/authService';

export default function adminAuthRoute() {
  const router = express.Router();

  const controller = adminAuthController(    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB,);

  router.post('/', controller.handleAdminLogin)

  return router;
}