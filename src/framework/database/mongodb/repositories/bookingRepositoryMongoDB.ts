import { Types } from "mongoose";
import {
  bookingInterface,
  bookingVenderInterface,
  createbookingInterface,
  getService,
} from "../../../../entities/bookingInterface";
import { sendService } from "../../../../utils/mailler";
import Booking from "../models/booking";
import BookingVender from "../models/bookingVender";
import { EventDocument } from "../models/event";
import { LocationDocument } from "../models/location";
import { UserDocument } from "../models/user";
import Vender, { VenterDocument } from "../models/vender";
import Notification from "../models/notification";

export const bookingRepositoryMongoDB = () => {
  const createBookingDb = async (booking: bookingInterface) => {
    
    let newBooking = new Booking(booking);

    await newBooking.save();
    return newBooking;
  };
  const getBookingHistory = async (data: object) =>
    await Booking.find(data)
      .populate<{ manager: UserDocument }>("manager")
      .populate<{ user: UserDocument }>("user")
      .populate<{ locationData: LocationDocument }>("locationData");


      const getBookingDetails = async (id: string) => {
        try {
         

          const data = await Booking.findById(id)
            .populate<{ manager: UserDocument }>("manager")
            .populate<{ user: UserDocument }>("user")
            .populate<{ locationData: LocationDocument }>("locationData")
            .populate<{ event:EventDocument }>("event")
            .populate<{ service:getService[] }>({
              path: "service.data",
              model: Vender,
            });
      
          if (!data) {
            throw new Error("Booking not found");
          }
      
      
          return data;
        } catch (error) {
          console.error("Error populating data: ", error);
          throw error;
        }
      };
  const messageManager = async (
    name: string | undefined,
    phone: string,
    manager: string | undefined
  ) => {
    await sendService(name, phone, manager);
  };

  const checkAvailableSlot = async (
    dateString: string,
    locationData: string
  ) => {
    try {
      const date = new Date(dateString);

      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const dataValue = {
        date: {
          $gte: start,
          $lte: end,
        },
        locationData,
      };
      const data = await Booking.find(dataValue, { _id: 0, time: 1 });

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const editbookingDb = async (id: any, updates: any) => {
    const event: createbookingInterface | null =
      await Booking.findByIdAndUpdate(id, updates, { new: true });
    return event;
  };

  const editServicebookingDb = async (id: any, updates: any, service_id: string[]) => {
    const objectIdServiceIds = service_id.map(id => new Types.ObjectId(id));
    console.log('objectIdServiceIds', objectIdServiceIds);
  
    const updateResult = await Booking.updateMany(
      { _id: id },
      {
        $set: { "service.$[elem].status": 'cancelled' }
      },
      {
        arrayFilters: [{ "elem.data": { $in: objectIdServiceIds } }]
      }
    );
  
    console.log(updateResult, 'updateResult');
    return updateResult;
  };
  

  const createVenderBookingDb = async (booking: bookingVenderInterface) => {
    
    let newBookingVender = new BookingVender(booking);

    const result = await newBookingVender.save();


    const resultbooked = await Booking.updateOne(
      { _id: booking.bookingData, "service.data": booking.venderData },
      { $set: { "service.$.status": 'booked' } }
    );
    
    return result;
  };



  const getvenderBookingHistory = async (data: object) =>
    await BookingVender.find(data)
      .populate<{ manager: UserDocument }>("manager")
      .populate<{ vender: UserDocument }>("vender")
      .populate<{ venderData: VenterDocument }>("venderData");



      const getvenderBookingDetails = async (id: string) => {
        try {
         

          const data = await BookingVender.findById(id)
            .populate<{ manager: UserDocument }>("manager")
            .populate<{ vender: UserDocument }>("vender")
            .populate<{ venderData: LocationDocument }>("venderData")
         
           
      
          if (!data) {
            throw new Error("Booking not found");
          }
      
      
          return data;
        } catch (error) {
          console.error("Error populating data: ", error);
          throw error;
        }
      };
  

  return {
    messageManager,
    createBookingDb,
    getBookingDetails,
    getBookingHistory,
    checkAvailableSlot,
    editbookingDb,
    createVenderBookingDb,
    editServicebookingDb,
    getvenderBookingHistory,
    getvenderBookingDetails
  };
};

export type bookingRepositoryMongoDBType = typeof bookingRepositoryMongoDB;
