import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()
// controller
import {
  createVisitor,
  updateVisitor,
  getAllVisitor,
  getVisitorDetails,
  getDetailsByNumber,
  getVisitorHistory,
  bulkUploadVisitor,
} from '../controllers/visitor.js'
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'
import { upload } from '../middlewares/uploads.js'

router.post(
  '/createvisitor',
  upload.single('file'),
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createVisitor)
)
router.put(
  '/updatevisitor',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateVisitor)
)
router.get(
  '/getallvisitor',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllVisitor)
)
router.get(
  '/getvisitordetails/:visitorid',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getVisitorDetails)
)
router.get(
  '/getdetailsbynumber/:input',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getDetailsByNumber)
)

router.get(
  '/getvisitorhistory/:visitorid',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getVisitorHistory)
)

router.post(
  '/bulkuploadvisitor',
  upload.single('file'),
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(bulkUploadVisitor)
)

export default router
