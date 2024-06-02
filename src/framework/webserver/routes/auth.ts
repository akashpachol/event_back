import express from 'express';
import authController from '../../../adapters/controllers/authcontroller';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authServiceInterface } from '../../../application/services/authServiceInterface';
import { userRepositoryMongoDB } from '../../database/mongodb/repositories/userRepositoryMongoDB';
import { authService } from '../../services/authService';


const authRouter = () => {
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
  router.post('/googleAuth', controller.googleAuth)
  router.post('/resend-otp', controller.otpResend)
  router.post('/logout', controller.userLogout)
  
  return router;
};

export default authRouter;