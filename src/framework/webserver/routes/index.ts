import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
import adminAuthRoute from "./adminAuth";
import adminRoute from "./admin";
import { eventRouter } from "./event";
import { locationRouter } from "./location";
import { venderRouter } from "./vender";

const routes = (app: Application) => {
    app.use("/auth", authRouter());
    app.use("/user",jwtTokenVerification, userRouter());
    app.use("/adminAuth", adminAuthRoute());
    app.use("/admin",jwtTokenVerification, adminRoute())
    app.use("/event", eventRouter())
    app.use("/location", locationRouter())
    app.use("/vender", venderRouter())

  };
  
  export default routes;
  