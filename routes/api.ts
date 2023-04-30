
import userRouter from "./user/user.routes";
import {Router} from "express";

const apiRoutes = Router();

apiRoutes.use('/user/',userRouter)

export default apiRoutes;
