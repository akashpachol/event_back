import { venderInterface } from "../../../entities/venderInterface";
import { UserRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
export const venderAdd = async (
  venderData: venderInterface,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  const { vender, name, address, description, image, type, price, state } =
    venderData;
  if (
    !name ||
    !address ||
    !vender ||
    !description ||
    !image ||
    !type ||
    !price ||
    !state
  ) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  return await repository.createVenderDb(venderData);
};

export const venderTypeAdd = async (
  vender: {
    name: string;
    description: string;
    image: string;
  },
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!vender.name || !vender.description || !vender.image) {
    throw new AppError("Fill All informations", HttpStatus.BAD_REQUEST);
  }

  return await repository.createVenderTypeDb(vender);
};
