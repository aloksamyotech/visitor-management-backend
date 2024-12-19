import { Router } from "express";
import { asyncHandler } from "../utils/asyncWrapper.js";
const router = Router();
// controller
import {
  createVisitor,
  updateVisitor,
  getAllVisitor,
  getVisitorDetails,
  getDetailsByNumber,
} from "../controllers/visitor.js";
import { employeeAuth, userAuth } from "../middlewares/userAuth.js";

router.post(
  "/createvisitor",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createVisitor),
);
router.put(
  "/updatevisitor",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateVisitor),
);
router.get(
  "/getallvisitor",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllVisitor),
);
router.get(
  "/getvisitordetails/:visitorid",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getVisitorDetails),
);
router.get(
  "/getdetailsbynumber",
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getDetailsByNumber),
);

export default router;
