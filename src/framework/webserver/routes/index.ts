import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
import adminAuthRoute from "./adminAuth";
import adminRoute from "./admin";
import venderAuth from "./venderAuth";


const routes = (app: Application) => {
    app.use("/auth", authRouter());
    app.use("/user",jwtTokenVerification, userRouter());
    app.use("/adminAuth", adminAuthRoute());
    app.use("/admin",jwtTokenVerification, adminRoute())
    app.use("/venderAuth", venderAuth());
  };
  
  export default routes;
  