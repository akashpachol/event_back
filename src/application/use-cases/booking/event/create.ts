import { bookingInterface } from "../../../../entities/bookingInterface";
import { CreateLocationInterface } from "../../../../entities/locationInterface";
import { bookingRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import { locationRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { NotificationRepositoryMongoDbType } from "../../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";
import { UserRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/userRepositoryMongoDB";
import { venderRepositoryMongoDBType } from "../../../../framework/database/mongodb/repositories/venterRepositoryMongoDB";
import { HttpStatus } from "../../../../types/httpStatus";
import AppError from "../../../../utils/appError";
const axios = require("axios");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "rzp_test_rwud39pugiL6zo",
  key_secret: "JLkOG8uWsGrEd7GthYgW475S",
});
export const bookEvent = async (
  booking: bookingInterface,
  locationrepository: ReturnType<locationRepositoryMongoDBType>,
  venderrepository: ReturnType<venderRepositoryMongoDBType>,
  bookingrepository:ReturnType<bookingRepositoryMongoDBType>,
) => {
  const {
    name,
    user,
    event,
    locationData,
    manager,
    count,
    date,
    time,
    phone,
    service,
  } = booking;

  if (!name || !locationData || !manager || !count || !date || !time) {
    throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
  }
  const location = await locationrepository.getLocationbyIdDb(locationData);

  if (!location) {
    throw new AppError("Location not found", HttpStatus.NOT_FOUND);
  }


const bookingVender = await bookingrepository.getVenderAvailabilityCheck(date);


let selected=bookingVender.map((service)=>{
 return  service.service.map(item => item.data.toString())
})
console.log(selected.flat(),'ggjhgjgjgj',selected);

console.log(service);


let filteredArray = service.filter((item:any) =>
  selected.flat().includes(item.data)
);
if(filteredArray.length>0){
  throw new AppError("Service not Available", HttpStatus.NOT_FOUND);

}
console.log(filteredArray,'filteredArray');

  const data: CreateLocationInterface = {
    _id: location._id,
    manager: location.manager,
    address: location.address,
    name: location.name,
    description: location.description,
    image: location.image,
    capasity: location.capasity,
    price: location.price,
    state: location.state,
    verify: location.verify,
    discountPrice: location.discountPrice
      ? location.discountPrice
      : location.price,
  };
  let totalamount = 0;
  if (data.discountPrice) {
    totalamount = data
      ? time == "full Day"
        ? 2 * data.discountPrice
        : data.discountPrice
      : 0;
    let serviceData = await Promise.all(
      service.map(async (value) => {
        return await venderrepository.getVenderByIdDb(value.data);
      })
    );

    const cateringTypeId = "667454b91595d4a56991565f";
    serviceData.forEach((item: any) => {
      if (item.type._id.toString() === cateringTypeId) {
        totalamount += parseInt(item.price, 10) * parseInt(count, 10);
      } else {
        totalamount += parseInt(item.price, 10);
      }
    });
  }



  let bookingData: bookingInterface = {
    user: user,
    manager,
    locationData,
    name,
    event,
    service,
    total: totalamount,
    date,
    time,
    count,
    phone,
    status: "pending",
  };

  let bookingDeatails = {
    ...bookingData,
    image: location.image[0].url,
    locationName: data.name,
  };

  return bookingDeatails;
};

export const payment = async (
  bookingData: bookingInterface,
) => {
  try {
    const options = {
      amount: bookingData.total * 100,
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
    };

    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err: Error | null, order: any) => {
        if (err) {
          console.error("Order creation error:", err);
          reject(
            new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE)
          );
        } else {
          resolve(order);
        }
      });
    });

    return { order };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};

export const capturepayment = async (
  bookingData: bookingInterface,
  paymentId: string,
  amountData: number,
  bookingrepository: ReturnType<bookingRepositoryMongoDBType>,
  userrepository: ReturnType<UserRepositoryMongoDBType>,
  notificationrepository: ReturnType<NotificationRepositoryMongoDbType>,
) => {
  try {
    const amount = amountData;
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
    if (response.status == 200) {
      bookingData = { ...bookingData, status: "booked" };
      const result = await bookingrepository.createBookingDb(bookingData);


      const notificationData={
        receiverId:bookingData.manager,
        senderId:bookingData.user,
        event:bookingData.status,
        booking:result._id
      }
  
      
      const notification = await notificationrepository.createNotification(notificationData);


      const managerData = await userrepository.getUserById(bookingData.manager);
      const userData = await userrepository.getUserById(bookingData.user);

      const data = await bookingrepository.messageManager(
        userData?.username,
        bookingData.phone,
        managerData?.email
      );
    }

    return { order: response.data, service };
  } catch (err) {
    throw new AppError("Something Went Wrong", HttpStatus.NOT_ACCEPTABLE);
  }
};
