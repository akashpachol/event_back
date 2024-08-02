import { venderInterface } from "../../../entities/venderInterface";
import { venderTypeInterface } from "../../../entities/venderTypeInterface";
import { venderRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const verifyVender = async (
  venderId: string,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!venderId) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }
  const vender = await repository.getVenderByIdDb(venderId);

  if (!vender) {
    throw new AppError("vender does not exist", HttpStatus.UNAUTHORIZED);
  }

  if (!vender.verify) {
    let updates = { verify: true };
    const vender = await repository.verifyVenderDb(venderId, updates);

    return { vender, message: "user blocked succesfully" };
  }
};

export const venderEdit = async (
  venderId: string,
  venderData: venderInterface,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!venderId) {
    throw new AppError("vender dose not exist", HttpStatus.NOT_FOUND);
  }
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
  return await repository.updateVenderdb(venderId, venderData);
};

export const VenderTypeBlock = async (
  vendertypeid: string,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!vendertypeid) {
    throw new AppError(
      "Somthing went wrong please log in again",
      HttpStatus.UNAUTHORIZED
    );
  }
  const event = await repository.getVenderTypebyIdDb(vendertypeid);

  if (!event) {
    throw new AppError("User Dose not exist", HttpStatus.UNAUTHORIZED);
  }
  if (!event.isBlocked) {
    let updates = { isBlocked: true };
    const event = await repository.updateVenderTypeByPropertydb(
      vendertypeid,
      updates
    );

    return { event, message: "Vender Type blocked succesfully" };
  } else {
    let updates = { isBlocked: false };
    const event = await repository.updateVenderTypeByPropertydb(
      vendertypeid,
      updates
    );

    return { event, message: "Vender Type Unblocked succesfully" };
  }
};

export const venderTypeEdit = async (
  venderId: string,
  venderTypeData: venderTypeInterface,
  repository: ReturnType<venderRepositoryMongoDBType>
) => {
  if (!venderId) {
    throw new AppError("vender dose not exist", HttpStatus.NOT_FOUND);
  }
  const { name, description, image } = venderTypeData;
  if (!name || !description || !image) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }
  return await repository.updateVenderTypedb(venderId, venderTypeData);
};
