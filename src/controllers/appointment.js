import * as appointmentService from '../services/appointment.js'
import { statusCodes } from '../core/common/constant.js'

export const scheduleAppointment = async (req, res, next) => {
  const appointmentDetails = await appointmentService.scheduleAppointment(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(appointmentDetails)
}

export const reScheduleAppointment = async (req, res, next) => {
  const updateAppointmentDetails =
    await appointmentService.reScheduleAppointment(req, res, next)
  res.status(statusCodes?.ok).send(updateAppointmentDetails)
}

export const updateAppointmentStatus = async (req, res, next) => {
  const updateAppointmentStatus =
    await appointmentService.updateAppointmentStatus(req, res, next)
  res.status(statusCodes?.ok).send(updateAppointmentStatus)
}

export const getAllAppointment = async (req, res, next) => {
  const getAllAppointment = await appointmentService.getAllAppointment(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAllAppointment)
}

export const getAppointmentByDate = async (req, res, next) => {
  const getAppointmentByDate = await appointmentService.getAppointmentByDate(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAppointmentByDate)
}

export const getAppointmentByAptID = async (req, res, next) => {
  const getAppointmentByAptID = await appointmentService.getAppointmentByAptID(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAppointmentByAptID)
}

export const getAppointmentByName = async (req, res, next) => {
  const getAppointmentByName = await appointmentService.getAppointmentByName(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAppointmentByName)
}
