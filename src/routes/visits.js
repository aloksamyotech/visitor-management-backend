import { Router } from "express";
import { asyncHandler } from "../utils/asyncWrapper.js";
const router = Router();
// controller
import { createEntry, exitVisitor, getAllEntry } from "../controllers/visits.js";
import { employeeAuth, userAuth } from "../middlewares/userAuth.js";

router.post("/createentry", asyncHandler(userAuth), asyncHandler(employeeAuth), asyncHandler(createEntry));
router.put("/updateentry", asyncHandler(userAuth), asyncHandler(employeeAuth), asyncHandler(exitVisitor));
router.get("/getallentry", asyncHandler(userAuth), asyncHandler(employeeAuth), asyncHandler(getAllEntry));

export default router;
