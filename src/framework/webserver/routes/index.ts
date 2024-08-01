import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import jwtTokenVerification from "../middleware/jwtTokenVerification";
import adminAuthRoute from "./adminAuth";
import adminRoute from "./admin";
import { eventRouter } from "./event";
import { locationRouter } from "./location";
import { venderRouter } from "./vender";
import { bookingRouter } from "./booking";
import { managerRouter } from "./manager";
import { offerRouter } from "./offer";
import { chatRouter } from "./chat";
import { messageRouter } from "./message";
import { notificationRouter } from "./notification";

const routes = (app: Application) => {
    app.use("/auth", authRouter());
    app.use("/user", userRouter());
    app.use("/adminAuth", adminAuthRoute());
    app.use("/admin",jwtTokenVerification, adminRoute())
    app.use("/event", eventRouter())
    app.use("/location", locationRouter())
    app.use("/vender", venderRouter())
    app.use("/booking", bookingRouter())
    app.use("/manager", managerRouter())
    app.use("/offer", offerRouter())
    app.use("/chat", chatRouter())
    app.use("/message", messageRouter())
    app.use("/notification", notificationRouter())

  };
  
  export default routes;
  