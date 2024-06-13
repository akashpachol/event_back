import { CreateEventInterface, EventInterface } from "../../../../entities/eventInterface";
import Event from "../models/event";

export const eventRepositoryMongoDB = () => {
  const createEventDb = async (eventData: EventInterface) => {
    const newEvent = new Event({
      name: eventData.name,
      description: eventData.description,
      image: eventData.image,
    });
    await newEvent.save();

    return newEvent;
  };
  const getEventDb=async()=>await Event.find();
  const getEventbyIdDb=async(id:string)=>await Event.findById(id);

  const updateEventByPropertydb = async (id: string, updates: any) => {
    console.log(updates, "jhfjdk");

    const event: CreateEventInterface | null = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return event;
  };

  const editEventDb = async (id: string, updates: any) => {
    console.log(updates, "jhfjdk");

    const event: CreateEventInterface | null = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    return event;
  };


  return {
    createEventDb,
    getEventDb,
    getEventbyIdDb,
    updateEventByPropertydb,
    editEventDb
  };
};

export type eventRepositoryMongoDBType = typeof eventRepositoryMongoDB;
