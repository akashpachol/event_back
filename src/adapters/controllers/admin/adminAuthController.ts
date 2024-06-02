import { NextFunction, Request, Response } from "express"
import { AuthService } from "../../../framework/services/authService"

import { adminLogin } from "../../../application/use-cases/auth/adminAuth"
import { AuthServiceInterface } from "../../../application/services/authServiceInterface"
import { HttpStatus } from "../../../types/httpStatus"
import { UserDbInterface } from "../../../application/repositories/userDbRepository"
import { UserRepositoryMongoDB } from "../../../framework/database/mongodb/repositories/userRepositoryMongoDB"

export default function adminAuthController(
    authServiceInterface: AuthServiceInterface,
    authServiceImpl: AuthService,
    userDbRepository: UserDbInterface,
    userDbRepositoryImpl: UserRepositoryMongoDB
){
    
    const services = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const handleAdminLogin = async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body

        const token = await adminLogin(
            email,
            password,
            services,
            dbRepositoryUser
        )

        res.status(HttpStatus.OK).json({status: 'success', message: 'Admin has been logged in succesfull', data:{access : token, refresh: ""}})
    }





    return {
        handleAdminLogin
    }

}