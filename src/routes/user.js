import { Router } from "express";
import { asyncHandler } from "../utils/asyncWrapper.js";
const router = Router();

// controller
import { userLogin, userRegistration } from "../controllers/user.js";

router.post("/register", asyncHandler(userRegistration));
router.post("/login", asyncHandler(userLogin));

export default router;
