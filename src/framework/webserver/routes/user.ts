import express from 'express';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { userRepositoryMongoDB } from '../../database/mongodb/repositories/userRepositoryMongoDB';
import userController from '../../../adapters/controllers/userController';


const userRouter = () =>{

    const router = express.Router();


    const controller = userController(
        userDbRepository,
        userRepositoryMongoDB
    )

    router
    .route("/profile/:userId")
    .get(controller.handleGetUserProfile)
    .patch(controller.handleUpdateUserProfile);
   

    router.patch('/profileimage/:userId', controller.handleUpdateProfileImage);
   

    return router
}

export default userRouter