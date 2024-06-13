import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";


import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";

import { venderInterface } from "../../../entities/venderInterface";
import { VenderWithIdGet, venderAdd, venderEdit } from "../../../application/use-cases/vender/venderAdd";
import { HttpStatus } from "../../../types/httpStatus";
import { VenderTypeBlock, VenderTypeGet, venderTypeAdd, venderTypeEdit } from "../../../application/use-cases/vender/venderTypeAdd";
import { venderTypeInterface } from "../../../entities/venderTypeInterface";
import { verifyVender, verifyVenderGet } from "../../../application/use-cases/vender/verifyVender";


export const venderController = (

  venderRepoimpl: venderRepositoryMongoDBType
) => {
  const repository = venderRepoimpl();


  const addVender = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const vender: venderInterface = req.body;
      const response = await venderAdd(vender, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "successfully added vender",
        
      });
    }

  );

  const EditVender = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const vender: venderInterface = req.body;
      const venderid: any | null = req.params.venderid;
      const response = await venderEdit(venderid,vender, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "successfully added vender",
        
      });
    }

  );


  const addVenderType = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const vender: venderTypeInterface = req.body;
      console.log(vender,"fdgfjdhfhfgd");
      
      const response = await venderTypeAdd(vender, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "successfully added vender type",
        
      });
    }
  );

  const EditVenderType = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const venderType: venderTypeInterface = req.body;
      const venderTypeid: any | null = req.params.venderTypeid;
      const response = await venderTypeEdit(venderTypeid,venderType, repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "successfully added vender",
        
      });
    }

  );

  const getVenderType = expressAsyncHandler(async (req: Request, res: Response) => {
    console.log(req.body,"req.body");
    
  
    const data=await VenderTypeGet(repository);


    res.status(HttpStatus.OK).json({
      status: "success",
      message: "get all event",
      data
    });

  });

  const handleBlockVenderType = expressAsyncHandler(
    async (req: Request, res: Response) => {
    
      const vendertypetId: any = req.body.vendertypetId;
      const {event,message} = await VenderTypeBlock( vendertypetId,repository);

      res.status(HttpStatus.OK).json({
        status: "success",
        message,
      data:event,
      });
    }
  );
  const getVenderWithId = expressAsyncHandler(async (req: Request, res: Response) => {
    const venderId:string = req.params.venderId;
    
  
    const data=await VenderWithIdGet(venderId,repository);


    res.status(HttpStatus.OK).json({
      status: "success",
      message: "get all event",
      data
    });

  });
  const venderVerify = expressAsyncHandler(async (req: Request, res: Response) => {

    const venderId:string = req.body.venderId;  


    const data=await verifyVender(venderId,repository);

 
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });
  
  const getVerifyVender= expressAsyncHandler(async (req: Request, res: Response) => {

    const data=await verifyVenderGet(repository);

 
    res.status(HttpStatus.OK).json({
      status: "success",
      message: "All users details has been fetched",
      data
    });
  });


  return {
    EditVender,
    EditVenderType,
    addVender,
    getVenderType,
    handleBlockVenderType,
    addVenderType,
    getVenderWithId,
    venderVerify,
    getVerifyVender
  };
};
