import { venderTypeInterface } from "../../../entities/venderTypeInterface";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const VenderTypeGet = async (
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  const getEvent = await repository.getVenderTypeDb();

  return getEvent;
};

export const verifyVenderGet = async (
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  let value = { verify: true };

  const venders = await repository.getAllVerifyVenderDb(value);
  let checkVenders = venders.filter((value) => {
    return value.vender.isBlocked === false;
  });

  return checkVenders;
};

export const venderFilter = async (
  value: string[],
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  const venders = await repository.filterVendersDb(value);

  return venders;
};

export const verifyVenderWithIdGet = async (
  venderId: string,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!venderId) {
    throw new AppError("Somthing went wrong ", HttpStatus.UNAUTHORIZED);
  }

  const data = await repository.getVenderByIdDb(venderId);

  return data;
};

export const VenderWithIdGet = async (
  venderId: string,
  repository: ReturnType<venderRepositoryMongoDBType>,
  dbRepositoryUser: ReturnType<UserRepositoryMongoDBType>
) => {
  if (!venderId) {
    throw new AppError("Somthing went wrong ", HttpStatus.UNAUTHORIZED);
  }
  const vender = await dbRepositoryUser.getUserById(venderId);

  if (!vender?.isBlocked) {
    const data = repository.getVenderbyVenderIdDb(venderId);
    console.log(data, "data");
    return data;
  } else {
    throw new AppError("Somthing went wrong ", HttpStatus.UNAUTHORIZED);
  }
};
