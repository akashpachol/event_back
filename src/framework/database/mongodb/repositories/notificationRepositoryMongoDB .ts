import mongoose from "mongoose";
import Notification from "../models/notification";
import User from "../models/user";
import { CreateUserInterface } from "../../../../entities/userinterfaces";

export const notficationRepositoryMongoDb = () => {
  const createNotification = async (notificationData: any) => {
    try {
      console.log(notificationData, "notificationData");

      const notification = new Notification(notificationData);

      return await notification.save();
    } catch (error) {
      console.log(error);
    }
  };

  const getNotifications = async (receiverId: string) => {
    try {
      const userData: CreateUserInterface = (await User.findById(
        receiverId
      )) as CreateUserInterface;
      console.log(userData.role,'gjgjkg');
      
      let notification;
      if (userData.role == "vender") {
        
        notification = await Notification.find({ receiverId })
          .sort({ createdAt: -1 })
          .populate("senderId")
          .populate({
            path: "bookingVender",
            populate: [
              {
                path: "venderData",
                select: "name",
              },
              {
                path: "event",
                select: "name ",
              },
            ],
          });
          
      } else {
        notification = await Notification.find({ receiverId })
          .sort({ createdAt: -1 })
          .populate("senderId", "username")
          .populate({
            path: "booking",
            populate: [
              {
                path: "locationData",
                select: "name",
              },
              {
                path: "event",
                select: "name ",
              },
            ],
          });


      }
      await Notification.updateMany({receiverId}, { $set: { isSeen: true } });
      
              return notification;
    } catch (error) {
      console.log(error);
    }
  };

  const getUreadNotifications = async (receiverId: string) => {
    try {
      let notification;

      notification = await Notification.find({ receiverId, isSeen: false });
      console.log(notification.length,'ApiResponseOfNotification');

      return notification.length;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getNotifications,
    getUreadNotifications,
    createNotification,
  };
};

export type NotificationRepositoryMongoDbType =
  typeof notficationRepositoryMongoDb;
