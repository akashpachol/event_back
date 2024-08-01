import { Request, Response } from "express";


import { offerRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/offerRepositoryMongoDB";

import { HttpStatus } from "../../../types/httpStatus";
import expressAsyncHandler from "express-async-handler";
import { offerInterface } from "../../../entities/offerInterface";
import { offerAdd, offerDelete, offerGet, offerUpdate } from "../../../application/use-cases/offer/offer";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";



export const offerController = (

  offerRepoimpl: offerRepositoryMongoDBType,
  locationRepoimpl: locationRepositoryMongoDBType
) => {
  const offerRepository = offerRepoimpl();
  const locationRepository = locationRepoimpl();


  const addOffer = expressAsyncHandler(async (req: Request, res: Response) => {

    
    const offer:offerInterface  = req.body;
   const result= await offerAdd(offer,offerRepository,locationRepository);


    res.status(HttpStatus.OK).json({
      status: "success",
      message: "offer added",
    });


  

  });
  const offerBlock = expressAsyncHandler(async (req: Request, res: Response) => {

    const { offerId } = req.body;
    
    const result= await offerDelete(offerId,locationRepository,offerRepository);

 
    
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "offer block",
    });
  });
  const offerEdit = expressAsyncHandler(async (req: Request, res: Response) => {

    const { offerId } = req.params;
    const offer:offerInterface  = req.body;
    const result= await offerUpdate(offerId,offer,locationRepository,offerRepository);

 
    
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "offer edited",
    });
  });



  const getOffer = expressAsyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params;
    const data= await offerGet(id,offerRepository);

 
    
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "get offers",
      data
    });
  });


  return {
    addOffer,
    offerBlock,
    getOffer,
    offerEdit

  };
};
