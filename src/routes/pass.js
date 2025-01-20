import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()

// controller
import {
  createPass,
  updatePassValidity,
  getAllPass,
  getPassByPassCode,
  getPassByName,
} from '../controllers/pass.js'
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'

router.post(
  '/createpass',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(createPass)
)
router.put(
  '/updatepassvalidity/:passId',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updatePassValidity)
)
router.get(
  '/getallpass',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllPass)
)
router.get(
  '/getpassbypasscode/:input',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getPassByPassCode)
)
router.get(
  '/getpassbyname',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getPassByName)
)

export default router
