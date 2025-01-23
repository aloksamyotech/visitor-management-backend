import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
const router = Router()

import {
  scheduleAppointment,
  reScheduleAppointment,
  getAllAppointment,
  getAppointmentByDate,
  getAppointmentByAptID,
  updateAppointmentStatus,
  getAppointmentByName,
} from '../controllers/appointment.js'
import { employeeAuth, userAuth } from '../middlewares/userAuth.js'

router.post(
  '/scheduleappointment',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(scheduleAppointment)
)
router.put(
  '/rescheduleappointment/:appointmentId',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(reScheduleAppointment)
)
router.put(
  '/updateappointmentstatus/:appointmentId',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(updateAppointmentStatus)
)
router.get(
  '/getallappointment',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAllAppointment)
)
router.get(
  '/getappointmentbydate',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAppointmentByDate)
)
router.get(
  '/getappointmentbyaptid/:input',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAppointmentByAptID)
)
router.get(
  '/getappointmentbyname',
  asyncHandler(userAuth),
  asyncHandler(employeeAuth),
  asyncHandler(getAppointmentByName)
)

export default router
