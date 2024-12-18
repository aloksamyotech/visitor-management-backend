import { Router } from "express";
import userRouter from "./user.js";
import visitorRouter from "./visitor.js";
import visitsRouter from "./visits.js"

const router = Router();

router.use('/user', userRouter);
router.use('/visitor', visitorRouter);
router.use('/visits', visitsRouter);

export default router;
