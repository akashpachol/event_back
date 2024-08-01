import mongoose from "mongoose";
import Notification from "../models/notification";
const { ObjectId } = mongoose.Types


export const notficationRepositoryMongoDb = () => {

    const createNotification = async ({ senderId, receiverId, event, postId }: { receiverId: string, senderId: string, event: string, postId?: string }) => {
        try {
            const notification = new Notification({
                senderId,
                receiverId,
                event,
                postId: postId 
            });

            await notification.save();

            return await Notification.findById(notification._id)
                .populate('postId', 'image')
                .populate('senderId');
        } catch (error) {
            console.log(error);
        }
    }

    const deleteNotification = async ({ senderId, receiverId, event, postId }: { receiverId: string, senderId: string, event: string, postId?: string }) => {
        try {
            const query: any = {
                senderId: new ObjectId(senderId),
                receiverId: new ObjectId(receiverId),
                event
            };
    
            if (postId) {
                query.postId = new ObjectId(postId);
            }
    
            const result = await Notification.findOneAndDelete(query);
            
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    const getNotifications = async (receiverId:string) => {
        try {
            const notifications = await Notification.find({ receiverId}).sort({ createdAt: -1 }).populate('senderId').populate('postId','image')
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    const readNotifications = async (userId: string) => {
        try {
            await Notification.updateMany({receiverId:userId}, { isSeen: true });
        } catch (error) {
            console.log(error)
        }
    }

    return {
        getNotifications,
        readNotifications,
        createNotification,
        deleteNotification
    }
}

export type NotificationRepositoryMongoDbType = typeof notficationRepositoryMongoDb