import {

    bookingVenderInterface,
  } from "../../../../entities/bookingInterface";
  
  import { bookingRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import { NotificationRepositoryMongoDbType } from "../../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";
  
  import { venderRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
  import { HttpStatus } from "../../../../types/httpStatus";
  import AppError from "../../../../utils/appError";
  const axios = require("axios");
  const Razorpay = require("razorpay");
  var instance = new Razorpay({
    key_id: "rzp_test_rwud39pugiL6zo",
    key_secret: "JLkOG8uWsGrEd7GthYgW475S",
  });
  export const bookVenderService = async (
    service: bookingVenderInterface,
    venderrepository: ReturnType<venderRepositoryMongoDBType>
  ) => {
    const { name, vender, event, venderData, manager, count, date } = service;
  
    if (!name || !venderData || !manager || !count || !date) {
      throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
    }
  
    const venderService = await venderrepository.getVenderByIdDb(venderData);
  
    if (!venderService) {
      throw new AppError("Location not found", HttpStatus.NOT_FOUND);
    }
  
    const cateringTypeId = "667454b91595d4a56991565f";
    let totalamount = 0;
    if (venderService.type.toString() === cateringTypeId) {
      totalamount += venderService.price * parseInt(count, 10);
    } else {
      totalamount += venderService.price;
    }
  
    let venderServiceData: bookingVenderInterface = {
      vender,
      manager,
      venderData,
      name,
      event,
      total: totalamount,
      date,
      count,
      status: "pending",
    };
  
    const options = {
      amount: totalamount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
    };
  
    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err: Error | null, order: any) => {
        if (err) {
          console.error("Order creation error:", err);
          reject(new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE));
        } else {
          resolve(order);
        }
      });
    });
  
    console.log("Order created successfully:", order);
    return venderServiceData;
  };
  
  export const venderCapturepayment = async (
    venderData: bookingVenderInterface,
    paymentId: string,
    amountData: number,
    bookingrepository: ReturnType<bookingRepositoryMongoDBType>,
    notificationrepository:ReturnType<NotificationRepositoryMongoDbType>,
  ) => {
    try {
      console.log(
        `Attempting to capture payment. Amount: ${amountData} (paise), Payment ID: ${paymentId}`
      );
  
      const amount = amountData * 100;
      const currency = "INR";
      const captureUrl = `https://api.razorpay.com/v1/payments/${paymentId}/capture`;
  
      const response = await axios.post(
        captureUrl,
        { amount, currency },
        {
          auth: {
            username: "rzp_test_rwud39pugiL6zo",
            password: "JLkOG8uWsGrEd7GthYgW475S",
          },
        }
      );
  
      let service: any | null = [];
      if (response.status === 200) {
        venderData = { ...venderData, status: "booked" };
  
        const result = await bookingrepository.createVenderBookingDb(venderData);

        const notificationData={
          receiverId:venderData.vender,
          senderId:venderData.manager,
          event:venderData.status,
          bookingVender:result._id
        }
        const notification = await notificationrepository.createNotification(notificationData);
        service = result;
        console.log("Booking created successfully:", result);
      } else {
        console.error("Failed to capture payment. Response status is not 200.");
      }
  
      return { order: response.data, service };
    } catch (err) {
      console.error("Error during payment capture:", err);
      throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
    }
  };
  