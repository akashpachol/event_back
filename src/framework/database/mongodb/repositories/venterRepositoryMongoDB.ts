
import { CreateVenderInterface, venderInterface } from "../../../../entities/venderInterface";
import { CreateVenderTypeInterface, venderTypeInterface } from "../../../../entities/venderTypeInterface";
import Vender from "../models/vender";
import VenderType from "../models/venderCategory";

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

    const imageUrls: string[] = Array.isArray(venderData.image) ? 
    venderData.image.map((image: { url: string }) => image.url) : 
    [];
    const newVender = new Vender({
      name: venderData.name,
      description: venderData.description,
      image: imageUrls,
      vender:venderData.vender,
      type:venderData.type,
      address:venderData.address,
      price:venderData.price,
      state:venderData.state,
      
    });
    await newVender.save();

  };

  const getVenderTypeDb=async()=>await VenderType.find();
  const getVenderTypebyIdDb=async(id:string)=>await VenderType.findById(id);

  const updateVenderTypeByPropertydb = async (id: string, updates: any) => {


    const venderTypeData: CreateVenderTypeInterface | null = await VenderType.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return venderTypeData;
  };
  const updateVenderdb = async (id: string, updates: any) => {


    const venderData: CreateVenderInterface | null = await Vender.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return venderData;
  };

  const updateVenderTypedb = async (id: string, updates: any) => {


    const venderData: CreateVenderTypeInterface | null = await VenderType.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return venderData;
  };
  

  const getVenderbyVenderIdDb=async (vender:string)=>{return await Vender.find({vender})}

  const verifyVenderDb = async (id: string, updates: any) => {
    const location: CreateVenderInterface | null = await Vender.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return location;
  };
  const getVenderByIdDb = async (id: string) => await Vender.findById(id);
  const getAllVerifyVenderDb=async (value:object) => await Vender.find(value);

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
    updateVenderTypedb
  };
};

export type venderRepositoryMongoDBType = typeof venderRepositoryMongoDB;
