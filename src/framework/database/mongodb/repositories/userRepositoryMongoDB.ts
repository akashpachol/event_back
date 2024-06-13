import User from "../models/user";
import { CreateUserInterface } from "../../../../entities/userinterfaces";
import { UserEntityType } from "../../../../entities/user";
import bcrypt from "bcrypt";
import { sendPassword } from "../../../../utils/mailler";

export const userRepositoryMongoDB = () => {
  const getUserByEmail = async (email: string,role:string) => {
    const user: CreateUserInterface | null = await User.findOne({ email,role });

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

    const existingUser: any = await getUserByEmail(user.email,user.role);

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

  const updateUserByProperty = async (id: string, updates: any) => {


    const user: CreateUserInterface | null = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );


    console.log(updates, "jhfjdk",user);
    return user;
  };

  const changeProfileImg = async (id: string, url: string) =>
    await User.findByIdAndUpdate(
      id,
      { $set: { image: url } },
      { upsert: true, new: true }
    );

  return {
    getUserByEmail,
    addUser,
    addGoogleUser,
    getUserById,
    updateUserByProperty,
    changeProfileImg,
    getAllUsers,
  };
};

export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
