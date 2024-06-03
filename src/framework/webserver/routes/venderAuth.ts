import express from 'express';
import authController from '../../../adapters/controllers/authcontroller';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authServiceInterface } from '../../../application/services/authServiceInterface';
import { userRepositoryMongoDB } from '../../database/mongodb/repositories/userRepositoryMongoDB';
import { authService } from '../../services/authService';


const venderAuth = () => {
  const router = express.Router();

  const controller = authController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDB,
  );

  router.post('/signup', controller.registerUser);
  router.post('/verify-otp', controller.verifyOtp)
  router.post('/login', controller.userLogin)


  
  return router;
};

export default venderAuth;