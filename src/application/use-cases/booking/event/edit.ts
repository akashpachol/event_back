

import { bookingRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import { NotificationRepositoryMongoDbType } from "../../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";

import { walletRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/walletRepositoryMongoDB";
import { HttpStatus } from "../../../../types/httpStatus";
import AppError from "../../../../utils/appError";




export const checkStatus = async (
  date: string,
  locationData: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>
) => {
  try {
    if (!date || !locationData) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const data = await bookingrepository.checkAvailableSlot(date, locationData);

    return { data };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};

export const cancelBooking = async (
  reason: string,
  bookingId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>,
  walletrepository: ReturnType<walletRepositoryMongoDBType>,
  notificationrepository: ReturnType<NotificationRepositoryMongoDbType>,
) => {
  try {
    if (!reason || !bookingId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const booking = await bookingrepository.getBookingDetails(bookingId);

    if(!booking._id)return

    if (booking?.status == "booked") {
      const user_id: string = booking?.user._id;
      let totalAmount = booking?.total;

      const walletData = await walletrepository.getWalletDb(user_id);

      if (walletData) {
        const createdWallet = await walletrepository.updatewalletBalancedb(
          user_id,
          totalAmount
        );
      } else {
        const createdWallet = await walletrepository.createWalletDb(
          user_id,
          totalAmount
        );
      }

      

      const updateBooking = await bookingrepository.editbookingDb(
        booking._id,
        { status: "cancelled" }
      );

      const notificationData={
        receiverId:booking.manager._id,
        senderId:booking.user._id,
        event:'cancelled',
        booking:booking._id
      }
      const notification = await notificationrepository.createNotification(notificationData);

      cancelService(reason, bookingId, bookingrepository, walletrepository,notificationrepository);
    }
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};

export const cancelService = async (
  reason: string,
  bookingId: string,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>,
  walletrepository: ReturnType<walletRepositoryMongoDBType>,
  notificationrepository: ReturnType<NotificationRepositoryMongoDbType>,

) => {
  try {
    if (!reason || !bookingId) {
      throw new AppError(
        "Please fill all the fields",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    const booking = await bookingrepository.getBookingDetails(bookingId);

    let totalAmount = 0;
    let user_id: string = "";
    let service_id: string[] = [];



  
console.log(booking.service,"booking.serviceA");


    if (booking.service.length > 0) {
      booking.service.map(async (value) => {
        console.log(value,'hjglkhgkj');

        if (value.status == "booked") {
          user_id = booking?.manager._id;
          totalAmount += value.data.price;

          const notificationData={
            receiverId:value.data.vender._id,
            senderId:user_id,
            event:'cancelled',
            bookingVender:value.data._id
          }
          const notification = await notificationrepository.createNotification(notificationData);


          if (value.data._id) {
            service_id.push(value.data._id);
          }




        }
      });

      const walletData = await walletrepository.getWalletDb(user_id);

      if (walletData) {
        const createdWallet = await walletrepository.updatewalletBalancedb(
          user_id,
          totalAmount
        );
      } else {
        const createdWallet = await walletrepository.createWalletDb(
          user_id,
          totalAmount
        );
      }

      const updateBooking = await bookingrepository.editServicebookingDb(
        booking?._id,
        { status: "cancelled" },
        service_id
      );

  
    }
  } catch (err: any) {
    throw new AppError(err.message, HttpStatus.NOT_ACCEPTABLE);
  }
};


