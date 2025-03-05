
import {
  CreateVenderInterface,
  venderInterface,
} from "../../../../entities/venderInterface";
import {
  CreateVenderTypeInterface,
  venderTypeInterface,
} from "../../../../entities/venderTypeInterface";
import { UserDocument } from "../models/user";
import Vender from "../models/vender";
import VenderType, { VenderTypeDocument } from "../models/venderCategory";

export const venderRepositoryMongoDB = () => {
  const createVenderTypeDb = async (venderData: venderTypeInterface) => {
    const newVenderType = new VenderType({
      name: venderData.name,
      description: venderData.description,
      image: venderData.image,
    });
    await newVenderType.save();
  };

  const createVenderDb = async (venderData: venderInterface) => {
    const imageUrls: string[] = Array.isArray(venderData.image)
      ? venderData.image.map((image: { url: string }) => image.url)
      : [];
    const newVender = new Vender({
      name: venderData.name,
      description: venderData.description,
      image: imageUrls,
      vender: venderData.vender,
      type: venderData.type,
      address: venderData.address,
      price: venderData.price,
      state: venderData.state,
    });
    await newVender.save();
  };

  const getVenderTypeDb = async () => await VenderType.find();
  const getVenderTypebyIdDb = async (id: string) =>
    await VenderType.findById(id);

  const updateVenderTypeByPropertydb = async (id: string, updates: any) => {
    const venderTypeData: CreateVenderTypeInterface | null =
      await VenderType.findByIdAndUpdate(id, updates, { new: true });
    return venderTypeData;
  };
  const updateVenderdb = async (id: string, updates: any) => {
    const venderData: CreateVenderInterface | null =
      await Vender.findByIdAndUpdate(id, updates, { new: true });
    return venderData;
  };

  const updateVenderTypedb = async (id: string, updates: any) => {
    const venderData: CreateVenderTypeInterface | null =
      await VenderType.findByIdAndUpdate(id, updates, { new: true });
    return venderData;
  };

  const getVenderbyVenderIdDb = async (vender: string) => {
    return await Vender.find({ vender });
  };

  const verifyVenderDb = async (id: string, updates: any) => {
    const location: CreateVenderInterface | null =
      await Vender.findByIdAndUpdate(id, updates, { new: true });
    return location;
  };
  const getVenderByIdDb = async (id: string) => {
    const data = await Vender.findById(id)
      .populate<{ type: VenderTypeDocument }>("type")
      .populate<{ vender: UserDocument }>("vender");

    return data;
  };
  const getAllVerifyVenderDb = async (value: object) =>
    await Vender.find(value).populate<{ vender: UserDocument }>("vender");
  const filterVendersDb = async (value: string[]) => {
    try {
      let result: CreateVenderInterface[];

      if (value.length > 0) {
        result = await Vender.find({
          $and: [{ type: { $in: value } }, { verify: true }],
        });
      } else {
        result = await Vender.find();
      }

      return result;
    } catch (error) {
      console.error("Error in filterVendersDb:", error);
      throw error;
    }
  };

  const getVenderById = (id: string) =>
    Vender.findById(id)
      .populate<{ type: VenderTypeDocument }>("type")
      .populate<{ vender: UserDocument }>("vender");


      const getVenderDetailsDb = async (vender: string) => {
        return await Vender.findById(vender);
      };

  return {
    createVenderTypeDb,
    createVenderDb,
    getVenderTypeDb,
    getVenderTypebyIdDb,
    updateVenderTypeByPropertydb,
    getVenderByIdDb,
    getAllVerifyVenderDb,
    getVenderbyVenderIdDb,
    verifyVenderDb,
    updateVenderdb,
    updateVenderTypedb,
    filterVendersDb,
    getVenderById,
    getVenderDetailsDb
  };
};

export type venderRepositoryMongoDBType = typeof venderRepositoryMongoDB;
