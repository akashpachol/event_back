import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import { AuthServiceInterface } from "../../../application/services/authServiceInterface";
import { UserDbInterface } from "../../repositories/userDbRepository";



export const adminLogin = async (email: string, password: string, services:ReturnType<AuthServiceInterface>, userRepository: ReturnType<UserDbInterface>, ) =>{
    const user = await userRepository.getUserByEmailValue(email);

   
    if (!user ) {
        throw new AppError("User not found", HttpStatus.UNAUTHORIZED);
      }
      if (!user._id ) {
        throw new AppError("User ID not found", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!user.isAdmin) {
        throw new AppError("User is NOT FOUND", HttpStatus.FORBIDDEN);
      }
      const isPasswordCorrect = await services.comparePassword(
        password,
        user.password
      );
  
      if (!isPasswordCorrect) {
        throw new AppError("Incorrect password", HttpStatus.UNAUTHORIZED);
      }
  
  
  
  
  
      const token = services.generateTokenValue(user._id.toString());

    return { token, user: user?.username,userId:user._id };


}