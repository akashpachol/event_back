import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { HttpStatus } from "../../../types/httpStatus";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { LocationWithIdGet, locationAdd, locationEdit } from "../../../application/use-cases/location/locationAdd";
import { LocationInterface } from "../../../entities/locationInterface";
import { verifyLocation } from "../../../application/use-cases/location/verifyLocation";

export const locationController = (

  locationRepoimpl: locationRepositoryMongoDBType
) => {
  const repository = locationRepoimpl();
  const addLocation = expressAsyncHandler(async (req: Request, res: Response) => {

    const location: LocationInterface = req.body;


    await locationAdd(location,repository);

  
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      
    });
  });
  const getLocationWithId = expressAsyncHandler(async (req: Request, res: Response) => {

    const maangerId:string = req.params.maangerId;
    const data=await LocationWithIdGet(maangerId,repository);
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All location is fetched",
      data
    });
  });

  const LocationVerify = expressAsyncHandler(async (req: Request, res: Response) => {
    const locationId:string = req.body.locationId;
    const data=await verifyLocation(locationId,repository);
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });


  const editLocation = expressAsyncHandler(async (req: Request, res: Response) => {
    const locationId:string = req.params.locationId;
const location=req.body
    const data=await locationEdit(locationId,location,repository);
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });






  return {
    addLocation,
    getLocationWithId,
    LocationVerify,
    editLocation
  };
};
