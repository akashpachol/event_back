import express from "express";
import { locationController } from "../../../adapters/controllers/location/locationController";

import { locationRepositoryMongoDB } from "../../database/mongodb/repositories/locationRepositoryMongoDB";
export const  locationRouter=()=>{
    const router = express.Router();
    const controller=locationController(locationRepositoryMongoDB)


    router.post('/addLocation', controller.addLocation);
    router.get('/getlocationwithid/:maangerId', controller.getLocationWithId);
    router.get('/getLocationDetails/:locationId', controller.getLocationDetails);
    router.post('/verfyLocation', controller.LocationVerify);
    router.put('/editLocation', controller.editLocation);

    return router
}