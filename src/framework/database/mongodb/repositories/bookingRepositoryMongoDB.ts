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
import mongoose from "mongoose";

export const bookingRepositoryMongoDB = () => {
  const createBookingDb = async (booking: bookingInterface) => {
    let newBooking = new Booking(booking);

    await newBooking.save();
    return newBooking;
  };
  const getBookingHistory = async (data: object) =>
    await Booking.find(data)
      .populate<{ manager: UserDocument }>("manager")
      .populate<{ event: EventDocument }>("event")
      .populate<{ user: UserDocument }>("user")
      .populate<{ locationData: LocationDocument }>("locationData")
      .sort({ date: -1 });

  const getBookingDetails = async (id: string) => {
    try {
      const data = await Booking.findById(id)
        .populate<{ manager: UserDocument }>("manager")
        .populate<{ user: UserDocument }>("user")
        .populate<{ locationData: LocationDocument }>("locationData")
        .populate<{ event: EventDocument }>("event")
        .populate<{ service: getService[] }>({
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

  const editServicebookingDb = async (
    id: any,
    updates: any,
    service_id: string[]
  ) => {
    const objectIdServiceIds = service_id.map((id) => new Types.ObjectId(id));
    console.log("objectIdServiceIds", objectIdServiceIds);

    const updateResult = await Booking.updateMany(
      { _id: id },
      {
        $set: { "service.$[elem].status": "cancelled" },
      },
      {
        arrayFilters: [{ "elem.data": { $in: objectIdServiceIds } }],
      }
    );

    console.log(updateResult, "updateResult");
    return updateResult;
  };

  const createVenderBookingDb = async (booking: bookingVenderInterface) => {
    let newBookingVender = new BookingVender(booking);

    const result = await newBookingVender.save();

    const resultbooked = await Booking.updateOne(
      { _id: booking.bookingData, "service.data": booking.venderData },
      { $set: { "service.$.status": "booked" } }
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
        .populate<{ venderData: LocationDocument }>("venderData");

      if (!data) {
        throw new Error("Booking not found");
      }

      return data;
    } catch (error) {
      console.error("Error populating data: ", error);
      throw error;
    }
  };

  const getLocationBookingDetails = async (id: string) => {
    try {
      const data = await Booking.find({
        locationData: id,
      }).populate<{ event: EventDocument }>("event");

      return data;
    } catch (error) {
      console.error("Error populating data: ", error);
      throw error;
    }
  };

  const getVenderBooking = async (id: string) => {
    try {
      const data = await BookingVender.find({
        locationData: id,
      }).populate<{ event: EventDocument }>("event");

      return data;
    } catch (error) {
      console.error("Error populating data: ", error);
      throw error;
    }
  };
  

  const getVenderAvailabilityCheck = async (date: string) => {
    try {
    
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999); 
        
        console.log(startOfDay, endOfDay, 'Date Range');

        const data = await Booking.find({
            date: {
                $gte: startOfDay.toISOString(),
                $lte: endOfDay.toISOString(),
            }
        }, {
          _id:0,
       
            'service.data': 1,
        });
        
        console.log(data, 'data');

        return data;
    } catch (error) {
        console.error("Error populating data: ", error);
        throw error;
    }
};

const getcheckBookingCount = async (year: number,id:string|null=null) => {
  try {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);


    const match: any = {
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    if (id) {
      match.manager = new mongoose.Types.ObjectId(id);
    }

    const data = await Booking.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
      {
        $group: {
          _id: null,
          months: {
            $push: {
              k: { $toString: "$month" },
              v: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: year,
          months: { $arrayToObject: "$months" },
        },
      },
      {
        $addFields: {
          year: year,
          months: {
            $mergeObjects: [
              { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0 }, // Default values
              "$months"
            ]
          }
        }
      }
    ]);
    console.log(data,'akash');

    return data.length > 0 ? data[0] : {
      year: year,
      months: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0 }
    };
  } catch (error) {
    console.error("Error populating data: ", error);
    throw error;
  }
};


const eventBooking = async (id:string) => {
  try {
   





      let managerId = new mongoose.Types.ObjectId(id);
    

    const data = await Booking.aggregate([
      {
        $match: {
          manager:managerId
        }
      },
      {
        $group: {
          _id: "$event", 
          count: { $sum: 1 } 
        }
      },
      {
        $lookup: {
          from: "events", 
          localField: "_id", 
          foreignField: "_id", 
          as: "eventDetails" 
        }
      },
      {
        $unwind: "$eventDetails" 
      },
      {
        $project: {
          _id: 0,
          event: "$eventDetails.name", 
          count: 1
        }
      }
    ]);
    
return data

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
    getvenderBookingDetails,
    getLocationBookingDetails,
    getVenderBooking,
    getVenderAvailabilityCheck,
    getcheckBookingCount,
    eventBooking
    
  };
};

export type bookingRepositoryMongoDBType = typeof bookingRepositoryMongoDB;

export const sendMailToManager = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const data = await Booking.find({
      createdAt: { $gte: today, $lt: tomorrow },
    })
      .populate<{ event: EventDocument }>("event")
      .populate<{ manager: UserDocument }>("manager")
      .populate<{ user: UserDocument }>("user");

    console.log(data, "kkkkk");

    return data;
  } catch (error) {
    console.error("Error populating data: ", error);
    throw error;
  }
};

export const sendMailToVender = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await BookingVender.find({
      createAt: today,
    }).populate<{ vender: UserDocument }>("vender");

    console.log(data, "kkkkk");

    return data;
  } catch (error) {
    console.error("Error populating data: ", error);
    throw error;
  }
};
