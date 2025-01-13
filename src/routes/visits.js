import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()
// controller
import {
  createEntry,
  exitVisitor,
  getAllEntry,
  getDashboardData,
  getEntryByDate,
} from '../controllers/visits.js'
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'

router.post(
  '/createentry',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createEntry)
)
router.put(
  '/updateentry/:visitid',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(exitVisitor)
)
router.get(
  '/getallentry',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllEntry)
)
router.get(
  '/getentrybydate',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getEntryByDate)
)
router.get(
  '/getdashboarddata',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getDashboardData)
)

export default router
