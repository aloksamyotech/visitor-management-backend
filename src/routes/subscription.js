import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'
import {
  createSubscription,
  getAllSubscription,
  updateSubscription,
} from '../controllers/subscription.js'

router.post(
  '/createsubscription',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createSubscription)
)
router.put(
  '/updatesubscription/:id',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateSubscription)
)
router.get(
  '/getallsubscription',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllSubscription)
)

export default router
