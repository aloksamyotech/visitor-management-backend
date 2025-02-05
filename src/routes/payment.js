import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'
import {
  companyPaymentHistory,
  createCheckoutSession,
  createPayment,
  getAllPaymentHistory,
  getCheckoutSessionDetails,
} from '../controllers/payment.js'

router.post(
  '/createpayment',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createPayment)
)
router.get(
  '/getallpaymenthistory',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllPaymentHistory)
)
router.get(
  '/companypaymenthistory/:companyid',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(companyPaymentHistory)
)

router.post(
  '/createcheckoutsession',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createCheckoutSession)
)
router.get(
  '/getcheckoutsessiondetails/:sessionId',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getCheckoutSessionDetails)
)
export default router
