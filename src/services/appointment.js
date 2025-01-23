import { Appointment } from '../models/appointment.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import moment from 'moment'
import { newVisitor } from './visitor.js'

export const scheduleAppointment = async (req) => {
  const {
    purpose,
    date,
    startTime,
    endTime,
    reference,
    comment,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityNumber,
    identityType,
    gender,
    address,
  } = req?.body || {}

  let { visitor } = req?.body || {}
  const { userid } = req?.user || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

  let uniqueId = false
  let appointmentId;
  while (!uniqueId) {
    appointmentId = Math.floor(10000 + Math.random() * 90000)
    const checkUnique = await Appointment.findOne({ appointmentId: appointmentId })
    if (!checkUnique) {
      uniqueId = true;
    }
  }

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const startMoment = moment(startTime, 'HH:mm')
  const endMoment = moment(endTime, 'HH:mm')
  let duration = endMoment.diff(startMoment, 'hours')
  if (duration < 1) {
    duration = 1
  }

  const data = {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy: userid,
    companyId,
  }

  if (!visitor) {
    const newVis = await newVisitor(data)
    visitor = newVis._id
  }

  const newAppointment = await Appointment.create({
    visitor,
    employee: userid,
    purpose,
    duration,
    date,
    startTime,
    endTime,
    reference,
    appointmentId,
    comment,
    companyId,
  })
  if (!newAppointment) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newAppointment }
}

export const reScheduleAppointment = async (req) => {
  const { appointmentId } = req?.params || {}
  const { date, startTime, endTime } = req?.body || {}

  const checkAppointment = await Appointment.findById(appointmentId)

  if (!checkAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  const updatedData = await Appointment.findByIdAndUpdate(
    appointmentId,
    { date, startTime, endTime },
    { new: true }
  )

  if (!updatedData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }

  return { updatedData }
}

export const updateAppointmentStatus = async (req) => {
  const { appointmentId } = req?.params || {}
  const { status } = req?.body || {}

  const checkAppointment = await Appointment.findById(appointmentId)

  if (!checkAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  const statusUpdate = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true }
  )

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { statusUpdate }
}

export const getAllAppointment = async (req) => {
  const { user } = req?.user || {}
  const companyId = user?.companyId
  const allappointment = await Appointment.find()
    .populate('visitor')
    .populate('reference')
    .sort({ createdAt: -1 })
  const allAppointment = allappointment?.filter(
    (apn) => apn?.companyId == companyId
  )
  if (!allAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allAppointment }
}

export const getAppointmentByDate = async (req) => {
  const { date } = req?.body || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

  if (!date) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const apt = await Appointment.find({ date })
  const appointments = apt.filter(apt => apt?.companyId == companyId)

  return appointments
}

export const getAppointmentByAptID = async (req) => {
  const { input } = req?.params || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

  if (!input) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const appointment = await Appointment.findOne({
    appointmentId: input,
    companyId: companyId
  }).populate('visitor')
  
  if (!appointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return appointment
}

export const getAppointmentByName = async (req) => {
  const { inputName } = req?.query || {}
  if (!inputName) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const appointment = await Appointment.find().populate({
    path: 'visitor',
    match: { firstName: inputName },
    select: 'firstName',
  })
  const filteredAppointment = appointment.filter((app) => app.visitor)

  if (filteredAppointment.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return filteredAppointment
}

export const newApn = async (data) => {
  const {
    visitor,
    employee,
    purpose,
    date,
    startTime,
    endTime,
    reference,
    comment,
    status,
    companyId,
  } = data || {}

  let uniqueId = false
  let appointmentId;
  while (!uniqueId) {
    appointmentId = Math.floor(10000 + Math.random() * 90000)
    const checkUnique = await Appointment.findOne({ appointmentId: appointmentId })
    if (!checkUnique) {
      uniqueId = true;
    }
  }

  const startMoment = moment(startTime, 'HH:mm')
  const endMoment = moment(endTime, 'HH:mm')
  let duration = endMoment.diff(startMoment, 'hours')
  if (duration < 1) {
    duration = 1
  }

  const newAppointment = await Appointment.create({
    visitor,
    employee,
    purpose,
    duration,
    date,
    startTime,
    endTime,
    reference,
    appointmentId,
    comment,
    status,
    companyId,
  })
  if (!newAppointment) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return newAppointment
}
