import { Request, Response } from "express";


import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";

import { HttpStatus } from "../../../types/httpStatus";



export const venderController = (

  venderRepoimpl: venderRepositoryMongoDBType
) => {
  const repository = venderRepoimpl();






  return {


  };
};
