import {
  CreateLocationInterface,
  LocationInterface,
} from "../../../../entities/locationInterface";
import Location from "../models/location";
export interface Image {
  url: string;
  type: string; // Optionally include type if needed
}
export const locationRepositoryMongoDB = () => {
  const createLocationDb = async (locationData: LocationInterface) => {
    console.log(locationData);
    const imageUrls= Array.isArray(locationData.image)
      ?     locationData.image.map((image: Image) =>{url:image.url} )

      : [];
      console.log(imageUrls,"llll");
      
    const newLocation = new Location({
      type: locationData.type,
      manager: locationData.manager,
      address: locationData.address,
      name: locationData.name,
      description: locationData.description,
      image: locationData.image,
      capasity: locationData.capasity,
      price: locationData.price,
      state: locationData.state,
    });
    return await newLocation.save();
  };

  const getLocationbyManagerIdDb = async (manager: string) => {
    return await Location.find({ manager });
  };
  const getLocationbyIdDb = async (id: string) => {
    return await Location.findById(id);
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
    getLocationbyIdDb
  };
};

export type locationRepositoryMongoDBType = typeof locationRepositoryMongoDB;
