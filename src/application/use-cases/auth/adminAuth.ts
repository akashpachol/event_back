import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";

import { AuthService } from "../../../framework/services/authService";
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB";



export const adminLogin = async (email: string, password: string,role:string, services:ReturnType<AuthService>, userRepository: ReturnType<UserRepositoryMongoDB>, ) =>{
    
  console.log(email,role);
  
  const user = await userRepository.getUserByEmail(email,role);

   
    if (!user ) {
        throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
      }
      if (!user._id ) {
        throw new AppError("User ID not found", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (user.role !=='admin') {
        throw new AppError("User is NOT FOUND", HttpStatus.FORBIDDEN);
      }
      const isPasswordCorrect = await services.comparePassword(
        password,
        user.password
      );
  
      if (!isPasswordCorrect) {
        throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
      }
  
  
  
  
  
      const token = services.generateToken(user._id.toString());

    return { token, user: user?.username,userId:user._id };


}