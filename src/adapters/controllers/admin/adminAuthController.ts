import { NextFunction, Request, Response } from "express"
import { AuthService } from "../../../framework/services/authService"

import { adminLogin } from "../../../application/use-cases/auth/adminAuth"
import { HttpStatus } from "../../../types/httpStatus"
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB"

export default function adminAuthController(

    authServiceImpl: AuthService,
  
    userDbRepositoryImpl: UserRepositoryMongoDB
){
    
    const services = authServiceImpl();
    const dbRepositoryUser = userDbRepositoryImpl();
    const handleAdminLogin = async (req: Request, res: Response,) => {
        const {email, password,role} = req.body

          const { token, user,userId } = await adminLogin(
            email,
            password,
            role,
            services,
            dbRepositoryUser
        )

        res.status(HttpStatus.OK).json({status: 'success', message: 'Admin has been logged in succesfull', token,
            admin:user,
            adminId:userId})
    }





    return {
        handleAdminLogin
    }

}