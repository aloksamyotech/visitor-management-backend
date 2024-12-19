import { Router } from "express";
import { asyncHandler } from "../utils/asyncWrapper.js";
const router = Router();

// controller
import {
  userDetails,
  userLogin,
  userRegistration,
  userUpdate,
} from "../controllers/user.js";
import { adminAuth, employeeAuth, userAuth } from "../middlewares/userAuth.js";

router.post("/register", asyncHandler(userRegistration));
router.post("/login", asyncHandler(userLogin));
router.get(
  "/getuserdetails",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(userDetails),
);
router.put(
  "/updateuserdetails",
  asyncHandler(userAuth),
  asyncHandler(adminAuth),
  asyncHandler(userUpdate),
);

export default router;
