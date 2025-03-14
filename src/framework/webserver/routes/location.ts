import express from "express";
import { locationController } from "../../../adapters/controllers/location/locationController";

import { locationRepositoryMongoDB } from "../../database/mongodb/repositories/locationRepositoryMongoDB";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
export const  locationRouter=()=>{
    const router = express.Router();
    const controller=locationController(locationRepositoryMongoDB)


    router.post('/addLocation', controller.addLocation);
    router.get('/getlocationwithid/:maangerId', controller.getLocationWithId);
    router.get('/getLocationDetails/:locationId', controller.getLocationDetails);
    router.post('/verfyLocation', controller.LocationVerify);
    router.put('/editLocation', controller.editLocation);
    router.get('/getVerifyLocation',controller.getVerifyLocation)
    router.post('/getFilteredlocation',controller.getFilteredlocation)

    return router
}