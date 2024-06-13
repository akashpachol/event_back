import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { eventAdd, eventBlock, eventEdit, eventGet } from "../../../application/use-cases/event/eventAdd";
import { eventRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/eventRepositoryMongoDB";
import { EventInterface } from "../../../entities/eventInterface";
import { HttpStatus } from "../../../types/httpStatus";

export const eventController = (
  eventRepoimpl: eventRepositoryMongoDBType
) => {
  const repository = eventRepoimpl()
  const addEvent = expressAsyncHandler(async (req: Request, res: Response) => {
    console.log(req.body,"req.body");
    
    const event: EventInterface = req.body;
    await eventAdd(event, repository);

    console.log("jhgfdhj");
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
    });
  });
  const getEvent = expressAsyncHandler(async (req: Request, res: Response) => {
    console.log(req.body,"req.body");
    
  
    const data=await eventGet(repository);


    res.status(HttpStatus.OK).json({
      status: "success",
      message: "get all event",
      data
    });

  });

  const handleBlockEvent = expressAsyncHandler(
    async (req: Request, res: Response) => {
    
      const eventId: any = req.body.eventId;
      const {event,message} = await eventBlock( eventId,repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message,
      data:event,
      });
    }
  );

  
  const editEvent = expressAsyncHandler(
    async (req: Request, res: Response) => {
    
      const eventId: any = req.params.eventId;
      const event: any = req.body;
      const response = await eventEdit( eventId,event,repository);

      res.status(HttpStatus.OK).json({
        status: "success",
   
  
      });
    }
  );


  return {
    editEvent,
    addEvent,
    getEvent,
    handleBlockEvent
  };
};
