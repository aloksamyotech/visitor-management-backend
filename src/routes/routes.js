import { Router } from "express";
const router = Router();

import userRouter from "./user.js";
import visitorRouter from "./visitor.js";
import visitsRouter from "./visits.js"
import appointmentRouter from "./appointment.js"

router.use('/user', userRouter);
router.use('/visitor', visitorRouter);
router.use('/visits', visitsRouter);
router.use('/appointment', appointmentRouter)

export default router;
