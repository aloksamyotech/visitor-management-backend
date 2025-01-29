import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()

import {
  getAllCompany,
  getAllUser,
  getUserDetailsById,
  logoUpdate,
  manageUserPermission,
  updateActiveStatus,
  updateUserPassword,
  userDetails,
  userLogin,
  userRegistration,
  userUpdate,
} from '../controllers/user.js'
import { adminAuth, employeeAuth, userAuth } from '../middlewares/userAuth.js'
import { upload } from '../middlewares/uploads.js'

router.post(
  '/register',
  upload.single('file'),
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(userRegistration)
)
router.post('/login', asyncHandler(userLogin))
router.get(
  '/getuserdetails',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(userDetails)
)
router.put(
  '/updateuserdetails',
  upload.single('file'),
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(userUpdate)
)
router.put(
  '/updatecompanylogo',
  upload.single('companyLogo'),
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(logoUpdate)
)
router.put(
  '/updateuserpassword',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateUserPassword)
)
router.put(
  '/manageuserpermission/:userid',
  asyncHandler(userAuth),
  asyncHandler(adminAuth),
  asyncHandler(manageUserPermission)
)
router.get(
  '/getalluser',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllUser)
)

router.get(
  '/getallcompany',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllCompany)
)
router.get(
  '/getuserdetails/:userid',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getUserDetailsById)
)
router.put('/updateactivestatus',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateActiveStatus)
)
export default router
