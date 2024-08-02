import { eventRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/eventRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
export const eventAdd = async (
  event: {
    name: string;
    description: string;
    image: string;
  },
  repository: ReturnType<eventRepositoryMongoDBType>
) => {
  if (!event.name || !event.description || !event.image) {
    throw new AppError("Fill All informations", HttpStatus.BAD_REQUEST);
  }
  await repository.createEventDb(event);

  return true;
};
