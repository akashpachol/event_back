import { eventRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/eventRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const eventBlock = async (
  eventId: string,
  repository: ReturnType<eventRepositoryMongoDBType>
) => {
  if (!eventId) {
    throw new AppError(
      "Somthing went wrong please log in again",
      HttpStatus.UNAUTHORIZED
    );
  }
  const event = await repository.getEventbyIdDb(eventId);

  if (!event) {
    throw new AppError("User Dose not exist", HttpStatus.UNAUTHORIZED);
  }
  if (!event.isBlocked) {
    let updates = { isBlocked: true };
    const event = await repository.updateEventByPropertydb(eventId, updates);

    return { event, message: "event blocked succesfully" };
  } else {
    let updates = { isBlocked: false };
    const event = await repository.updateEventByPropertydb(eventId, updates);

    return { event, message: "event Unblocked succesfully" };
  }
};

export const eventEdit = async (
  id: string,
  event: {
    name: string;
    description: string;
    image: string;
  },
  repository: ReturnType<eventRepositoryMongoDBType>
) => {
  if (!id) {
    throw new AppError("Hotel dose not exist", HttpStatus.NOT_FOUND);
  }

  if (!event.name || !event.description || !event.image) {
    throw new AppError("Fill All informations", HttpStatus.BAD_REQUEST);
  }
  await repository.editEventDb(id, event);

  return true;
};
