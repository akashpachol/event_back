import { eventRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/eventRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const eventGet = async (
  repository: ReturnType<eventRepositoryMongoDBType>
) => {
  const getEvent = await repository.getEventDb();

  return getEvent;
};
