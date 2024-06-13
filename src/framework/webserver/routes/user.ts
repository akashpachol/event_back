import express from 'express';
import { userRepositoryMongoDB } from '../../database/mongodb/repositories/userRepositoryMongoDB';
import userController from '../../../adapters/controllers/userController';
import { locationRepositoryMongoDB } from '../../database/mongodb/repositories/locationRepositoryMongoDB';
import { venderRepositoryMongoDB } from '../../database/mongodb/repositories/venterRepositoryMongoDB';


const userRouter = () =>{

    const router = express.Router();


    const controller = userController(
        userRepositoryMongoDB,
        locationRepositoryMongoDB,
    )

    router
    .route("/profile/:userId")
    .get(controller.handleGetUserProfile)
    .patch(controller.handleUpdateUserProfile);
   
    router.get('/getVerifyLocation',controller.getVerifyLocation)

    router.patch('/profileimage/:userId', controller.handleUpdateProfileImage);
   

    return router
}

export default userRouter