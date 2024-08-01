import { CreateOfferInterface, offerInterface } from "../../../entities/offerInterface";
import { locationRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/locationRepositoryMongoDB";
import { offerRepositoryMongoDBType } from "../../../framework/database/mongodb/repositories/offerRepositoryMongoDB";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";



export const offerAdd = async (
offer:offerInterface,offerRepository:ReturnType<offerRepositoryMongoDBType>,locationRepository:ReturnType<locationRepositoryMongoDBType>
) => {
  


    const {
    name,
    startDate,
    endDate,
    discountValue,
    discountedManager,
    isActive
      } = offer;
    
      if (
        !name ||
        !startDate ||
        !endDate ||
        !discountValue ||
        !discountedManager 
     
       
      ) {
        throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
      }
 
    
      const existingNameOffer = await offerRepository.getOfferDataDb({name})
      
      const existingManagerOffer = await offerRepository.getOfferDataDb({discountedManager})
      if (Array.isArray(existingNameOffer) && existingNameOffer.length > 0) {
        throw new AppError("Duplicate Discount Name not allowed.", HttpStatus.BAD_REQUEST);
      }
    
      if (Array.isArray(existingManagerOffer) && existingManagerOffer.length > 0) {
        throw new AppError("An offer for this manager already exists.", HttpStatus.BAD_REQUEST);
      }
    
    await offerRepository.createOfferDb({...offer,isActive:true});

      const locationData = await locationRepository.getLocationbyManagerIdDb(discountedManager);

        const result= await locationRepository.addOfferToLocation(locationData,discountValue,startDate,endDate,true)
      return true;
    }


    export  const offerGet=async (
     id:string, repository:ReturnType<offerRepositoryMongoDBType>)=>{
        const getEvent = await repository.getofferDb(id);
    
        return getEvent;
      }

      export  const offerUpdate=async (
        offerId:string,offer:offerInterface,locationRepository:ReturnType<locationRepositoryMongoDBType>,
        offerRepository:ReturnType<offerRepositoryMongoDBType>)=>{

          if(!offerId){
            throw new AppError("offer dose not exist", HttpStatus.NOT_FOUND)
        }
          const {
            name,
            startDate,
            endDate,
            discountValue,
            discountedManager,
         
              } = offer;
            
              if (
                !name ||
                !startDate ||
                !endDate ||
                !discountValue ||
                !discountedManager 
             
               
              ) {
                throw new AppError("Please fill all the fields", HttpStatus.NOT_ACCEPTABLE);
              }

      
       
        
      
        
        await offerRepository.updateOfferByPropertydb(offerId,{...offer,isActive:true});

          const locationData = await locationRepository.getLocationbyManagerIdDb(discountedManager);

            const result= await locationRepository.addOfferToLocation(locationData,discountValue,startDate,endDate,true)
          return true;
        }

        export  const offerDelete=async (
          offerId:string,locationRepository:ReturnType<locationRepositoryMongoDBType>,
          offerRepository:ReturnType<offerRepositoryMongoDBType>)=>{
  
            if(!offerId){
              throw new AppError("offer dose not exist", HttpStatus.NOT_FOUND)
          }

          const offer:CreateOfferInterface |null = await offerRepository.getOfferbyIdDb(offerId);
          if(!offer){
            throw new AppError("offer dose not exist", HttpStatus.NOT_FOUND)

          }
               
          offer.isActive = !offer.isActive;

       
        
         
        
      
          
          await offerRepository.updateOfferByPropertydb(offerId,{isActive: offer.isActive});

            const locationData = await locationRepository.getLocationbyManagerIdDb(offer.discountedManager);

              const result= await locationRepository.addOfferToLocation(locationData,offer.discountValue,offer.startDate,offer.endDate, offer.isActive)
            return true;
          }



        

