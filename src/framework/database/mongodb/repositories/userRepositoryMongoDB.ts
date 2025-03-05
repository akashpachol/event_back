import User from "../models/user";
import { CreateUserInterface } from "../../../../entities/userinterfaces";
import { UserEntityType } from "../../../../entities/user";
import bcrypt from "bcrypt";
import { sendPassword } from "../../../../utils/mailler";
import mongoose from "mongoose";
import Location from "../models/location";
import Booking from "../models/booking";

export const userRepositoryMongoDB = () => {
  const getUserByEmail = async (email: string, role: string) => {
    const user: CreateUserInterface | null = await User.findOne({
      email,
      role,
    });

    return user;
  };

  const addUser = async (user: UserEntityType) => {
    const newUser: any = new User({
      username: user.username,
      role: user.role,
      email: user.email,

      password: user.password,
    });
    newUser.save();

    return newUser;
  };

  const getAllUsers = async (value: object) => await User.find(value);

  const addGoogleUser = async (user: UserEntityType) => {
    if (!user.email) {
      throw new Error("Email is required");
    }
    if (!user.role) {
      throw new Error("role is required");
    }

    const existingUser: any = await getUserByEmail(user.email, user.role);

    if (existingUser) {
      if (existingUser.isGoogle) {
        let user = {
          _id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
        };

        return user;
      } else {
        throw new Error("user already exists with this email.");
      }
    }
    const randomPassword = Math.random().toString(36).slice(-8);

    await sendPassword(user.email, randomPassword);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newUser: any = new User({
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      isGoogle: true,
    });
    newUser.save();

    return newUser;
  };

  const getUserById = async (id: string) => await User.findById(id);
  const getManger = async (role: string) => await User.find({ role });
  const getAllPerson = async (role: string,userId:string) => {
    return await User.find({ role: { $ne: role } ,_id:{$ne:userId}});
  };
  const getAllManager = async () => {
    return await User.find({ role:'manager'});
  };

  const updateUserByProperty = async (id: string, updates: any) => {
    const user: CreateUserInterface | null = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    console.log(updates, "jhfjdk", user);
    return user;
  };

  const changeProfileImg = async (id: string, url: string) =>
     await User.findByIdAndUpdate(
      id,
      { $set: { image: url } },
      { upsert: true, new: true }
    );
    interface UserQuery {
      $or?: {
        username?: { $regex: string; $options: string };
        email?: { $regex: string; $options: string };
      }[];
      role?: { $ne?: string; $eq?: string };
      _id?: { $ne: mongoose.Types.ObjectId };
    }
    
    const searchValue = async (data: string | undefined, role: string, id: string) => {
      const query: UserQuery = {};
    
      if (data) {
        query.$or = [
          { username: { $regex: data, $options: "i" } },
          { email: { $regex: data, $options: "i" } },
        ];
      }
    
      if (role === 'admin') {
        query.role = { $ne: 'admin' };
      } else {
        query.role = { $eq: role };
      }
    
      if (id) {
        query._id = { $ne: new mongoose.Types.ObjectId(id) };
      }
    
      try {
        const users = await User.find(query).exec(); 
        console.log(users);
        return users;
      } catch (error) {
        console.error("Error in searching users", error);
        throw new Error("Unable to search users");
      }
    };

    interface locationQuery {
      $or?: {
        state?: { $regex: string; $options: string };
     
      }[];
      verify: boolean;
    }

    const searchLocationValue = async (data: string | undefined) => {
      const query: locationQuery = { verify: true};
    
      if (data) {
        query.$or = [
          { state: { $regex: data, $options: "i" } },
        
        ];
      }else{
        const users = await Location.find({verify:true}).exec(); 
        console.log(users,'location');
        return users;
      }
    
      try {
        const users = await Location.find(query).exec(); 
        console.log(users,'location');
        return users;
      } catch (error) {
        console.error("Error in searching users", error);
        throw new Error("Unable to search users");
      }
    };

    const getAllData = async () => {
      let data:{user:number,manager:number,vender:number,hotels:number,sales:number,booking:number}={user:0,manager:0,vender:0,hotels:0,sales:0,booking:0}

      data.user = await User.countDocuments({ role: 'user' });
      data.manager = await User.countDocuments({ role: 'manager' });
      data.vender = await User.countDocuments({ role: 'vender' });
      data.hotels = await Location.countDocuments();
      data.booking = await Booking.countDocuments();
    const result= await Booking.aggregate([
        {
          $group: {
            _id: null,
            totalSum: { $sum: "$total" }
          }
        }
      ])
      data.sales =result.length > 0?result[0].totalSum:0
      return data
    };

  
const getAllRoleData = async (id: string) => {
  try {
    let data: { hotels: number; sales: number; booking: number } = {
      hotels: 0,
      sales: 0,
      booking: 0,
    };

    let roleId = new mongoose.Types.ObjectId(id);

    data.hotels = await Location.countDocuments({ manager: roleId });

    data.booking = await Booking.countDocuments({ manager: roleId });

    const result = await Booking.aggregate([
      { $match: { manager: roleId } },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$total" },
        },
      },
    ]);

    data.sales = result.length > 0 ? result[0].totalSum : 0;

    return data;
  } catch (error) {
    console.error('Error fetching role data:', error);
    throw new Error('Could not retrieve role data');
  }
};
    

  return {
    getUserByEmail,
    addUser,
    addGoogleUser,
    getUserById,
    updateUserByProperty,
    changeProfileImg,
    getAllUsers,
    searchValue,
    getManger,
    getAllPerson,
    searchLocationValue,
    getAllManager,
    getAllData,
    getAllRoleData
  };
};

export type UserRepositoryMongoDBType = typeof userRepositoryMongoDB;
