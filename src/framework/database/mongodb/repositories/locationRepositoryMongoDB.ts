import { Types } from "mongoose";
import {
  CreateLocationInterface,
  LocationInterface,
} from "../../../../entities/locationInterface";
import Location from "../models/location";
import { UserDocument } from "../models/user";
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

  const getLocationbyManagerIdDb = async (manager: string|Types.ObjectId ) => {
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
    await Location.find(value).populate<{ manager: UserDocument }>('manager');

  const addOfferToLocation = async (locationData: CreateLocationInterface[], discountValue: number, startDate: Date, expiryDate: Date, isActive: boolean) => {
    for (const location of locationData) {
      let discount = 0;
      
      if (!isActive) {
        location.discountPrice = location.price;
      } else {
        discount = (location.price * discountValue) / 100;
  
        location.discountPrice = calculateDiscountPrice(
          location.price,
          discountValue
        );
      }
      
      await Location.updateOne(
        { _id: location._id },
        {
          $set: {
            discountPrice: location.discountPrice,
            discount,
            discountStart: startDate,
            discountEnd: expiryDate,
            discountStatus: true,
          },
        }
      );
    }
  }
  
  
    function calculateDiscountPrice(price:number, discountValue:number) {

      let discountedPrice = price;
    
      
        discountedPrice -= (price * discountValue) / 100;
      
    
      return discountedPrice;
    }

    const getFilterLocationbyIdDb = async (data: any) => {
      console.log(data, 'ffjfjfjfj', data.count.length);
    
      let location;
      const query: any = {};
      query.verify=true
      if (data.count.length > 0) {
        const minCount = Math.max(...data.count);
        query.capasity = { $lte: minCount };
      }
    
      if (data.price.length > 0 &&data.price[1]>0 ) {
        query.price = { $gte: data.price[0], $lte: data.price[1] };
      }
    
      if (Object.keys(query).length > 0) {
        location = await Location.find(query);
        console.log( query.count, 'ggggg');

      } else {
        location = await Location.find({verify:true});
      }
    
      return location;
    };
    
  return {
    createLocationDb,
    getLocationbyManagerIdDb,
    verifyLocationDb,
    getLocationByIdValueDb,
    getAllVerifyLocationDb,
    getLocationbyIdDb,
    addOfferToLocation,
    getFilterLocationbyIdDb
  };
};

export type locationRepositoryMongoDBType = typeof locationRepositoryMongoDB;
