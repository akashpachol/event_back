import { NotificationRepositoryMongoDbType } from "../../../framework/database/mongodb/repositories/notificationRepositoryMongoDB ";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";


export const handleGetNotifications=async(
    userId:string,
    notificationDbRepository:ReturnType<NotificationRepositoryMongoDbType>
)=>{
    try {
        const notifications=await notificationDbRepository.getNotifications(userId)
        return notifications
    } catch (error) {
        console.log('error in fetching notifications',error)
        throw new AppError('Error in fetching notification',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleReadNotification=async(
    userId:string,
    notificationDbRepository:ReturnType<NotificationRepositoryMongoDbType>
)=>{
    try {
        await notificationDbRepository.readNotifications(userId)
    } catch (error) {
        console.log('error in handling read notification',error)
        throw new AppError('Error in handling read notification',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

