
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_DB_URL;
        if (!mongoURI) {
            throw new Error('MONGO_URI environment variable is not defined.');
        }
      
        
        await mongoose.connect(mongoURI);
        console.log(`Database connected successfully`);
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;