import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()
// controller
import {
  adminDashboardData,
  adminReport,
  companyEmpCount,
  createEntry,
  createEntryUsingApn,
  createEntryUsingPass,
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

router.post(
  '/createentryusingapn',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createEntryUsingApn)
)

router.post(
  '/createentryusingpass',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createEntryUsingPass)
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

router.get(
  '/admindashboarddata',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(adminDashboardData)
)

router.get(
  '/adminreport',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(adminReport)
)

router.get(
  '/companyempcount',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(companyEmpCount)
)

export default router
