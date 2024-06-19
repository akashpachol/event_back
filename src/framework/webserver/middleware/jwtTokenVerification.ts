import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import { HttpStatus } from '../../../types/httpStatus';
import { authService } from '../../services/authService';

const authServiceMiddleware = authService();

export default async function jwtTokenVerification(req: Request, res: Response, next: NextFunction) {
    let token: string | null = '';
   
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
console.log(token);

    if (!token) {
        return next(new AppError('Token not found', HttpStatus.UNAUTHORIZED));
    }

    try {
        const { payload }: any = await authServiceMiddleware.verifyToken(token);  

     

        next();
    } catch (err) {
        next(new AppError('UnAuthorized User', HttpStatus.UNAUTHORIZED));
    }
}
