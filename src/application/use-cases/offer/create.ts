import {

  offerInterface,
} from "../../../entities/offerInterface";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { offerRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/offerRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

export const offerAdd = async (
  offer: offerInterface,
  offerRepository: ReturnType<offerRepositoryMongoDBType>,
  locationRepository: ReturnType<locationRepositoryMongoDBType>
) => {
  const {
    name,
    startDate,
    endDate,
    discountValue,
    discountedManager,
    isActive,
  } = offer;

  if (!name || !startDate || !endDate || !discountValue || !discountedManager) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }

  const existingNameOffer = await offerRepository.getOfferDataDb({ name });

  const existingManagerOffer = await offerRepository.getOfferDataDb({
    discountedManager,
  });
  if (Array.isArray(existingNameOffer) && existingNameOffer.length > 0) {
    throw new AppError(
      "Duplicate Discount Name not allowed.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (Array.isArray(existingManagerOffer) && existingManagerOffer.length > 0) {
    throw new AppError(
      "An offer for this manager already exists.",
      HttpStatus.BAD_REQUEST
    );
  }

  await offerRepository.createOfferDb({ ...offer, isActive: true });

  const locationData = await locationRepository.getLocationbyManagerIdDb(
    discountedManager
  );

  const result = await locationRepository.addOfferToLocation(
    locationData,
    discountValue,
    startDate,
    endDate,
    true
  );
  return true;
};
