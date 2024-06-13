import {
  CreateLocationInterface,
  LocationInterface,
} from "../../../../entities/locationInterface";
import Location from "../models/location";

export const locationRepositoryMongoDB = () => {
  const createLocationDb = async (locationData: LocationInterface) => {
    console.log(locationData);
    const imageUrls: string[] = Array.isArray(locationData.image)
      ? locationData.image.map((image: { url: string }) => image.url)
      : [];
    const newLocation = new Location({
      type: locationData.type,
      manager: locationData.manager,
      address: locationData.address,
      name: locationData.name,
      description: locationData.description,
      image: imageUrls,
      capasity: locationData.capasity,
      price: locationData.price,
      state: locationData.state,
    });
    return await newLocation.save();
  };

  const getLocationbyManagerIdDb = async (manager: string) => {
    return await Location.find({ manager });
  };

  const verifyLocationDb = async (id: string, updates: any) => {
    const location: CreateLocationInterface | null =
      await Location.findByIdAndUpdate(id, updates, { new: true });
    return location;
  };
  const getLocationByIdValueDb = async (id: string) =>
    await Location.findById(id);
  const getAllVerifyLocationDb = async (value: object) =>
    await Location.find(value);


  
  return {
    createLocationDb,
    getLocationbyManagerIdDb,
    verifyLocationDb,
    getLocationByIdValueDb,
    getAllVerifyLocationDb,
  };
};

export type locationRepositoryMongoDBType = typeof locationRepositoryMongoDB;
