import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { Visit } from '../models/visits.js'
import { VisitorHistory } from '../models/visitorHistory.js'
import { newVisitor } from './visitor.js'
import { Visitor } from '../models/visitor.js'
import { Appointment } from '../models/appointment.js'
import { Pass } from '../models/pass.js'

export const createEntry = async (req) => {
  const {
    duration,
    comment,
    reference,
    entryType,
    appointmentId,
    passId,
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
  const { userid } = req?.user || {} //fetching employee id
  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  if (passId) {
    const passData = await Pass.findOne({ _id: passId })
    if (passData?.dailyCount >= passData?.maxEntryPerDay) {
      passData.status = 'expired'
      await passData.save()
      throw new CustomError(
        statusCodes?.conflict,
        Message?.passValidityExpired,
        errorCodes?.pass_expire
      )
    }
    if (passData?.count >= passData?.maxCount) {
      passData.status = 'expired'
      await passData.save()
      throw new CustomError(
        statusCodes?.conflict,
        Message?.passValidityExpired,
        errorCodes?.pass_expire
      )
    }
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
  }

  if (!visitor) {
    const newVis = await newVisitor(data)
    visitor = newVis._id
  }

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    comment,
    relatedTo: reference,
    entryType,
    appointmentId,
    passId,
  })

  if (!entryData) {
    throw new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable
    )
  }
  const updateCount = await Visitor.findOne({ _id: visitor })
  if (updateCount) {
    updateCount.totalVisit += 1
    await updateCount.save()
  }

  if (passId) {
    const updatePassCount = await Pass.findOne({ _id: passId })
    if (!updatePassCount) {
      throw new CustomError(
        statusCodes?.badRequest,
        Message?.notUpdated,
        errorCodes?.not_found
      )
    }
    updatePassCount.count += 1
    updatePassCount.dailyCount += 1
    await updatePassCount.save()
  }

  const updateLogsInHistory = await VisitorHistory.findOneAndUpdate(
    { visitor },
    {
      $push: { visitHistory: entryData._id },
    }
  )

  if (!updateLogsInHistory) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated,
      errorCodes?.not_found
    )
  }

  if (appointmentId) {
    await Appointment.findByIdAndUpdate(
      { _id: appointmentId },
      { status: 'checkIn' }
    )
  }

  return { entryData }
}

export const exitVisitor = async (req) => {
  const { visitid } = req?.params || {}

  if (!visitid) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notFound,
      errorCodes?.invalid_input
    )
  }
  const visit = await Visit.findById(visitid)
  if (!visit) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  visit.active = false
  visit.exitTime = new Date()
  await visit.save()

  const ApnID = visit?.appointmentId
  if (ApnID) {
    await Appointment.findByIdAndUpdate(
      { _id: ApnID },
      {
        status: 'completed',
      }
    )
  }

  return { visit }
}

export const getAllEntry = async () => {
  const allEntry = await Visit.find()
    .populate('visitor')
    .sort({ createdAt: -1 })
  if (!allEntry) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allEntry }
}

export const getEntryByDate = async (req) => {
  const { startDate, endDate } = req?.query || {}

  const allEntry = await Visit.find().populate('visitor')
  if (!allEntry) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  if (startDate && endDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`)
    const end = new Date(`${endDate}T23:59:59.999Z`)
    const filteredData = allEntry?.filter((item) => {
      const itemDate = new Date(item?.createdAt)
      return itemDate >= start && itemDate <= end
    })
    const appointmentCount = filteredData.filter(
      (item) => item.entryType === 'appointment'
    ).length
    const passCount = filteredData.filter(
      (item) => item.entryType === 'pass'
    ).length

    return { filteredData, appointmentCount, passCount }
  }
}

export const getDashboardData = async () => {
  const allEntry = await Visit.find()
  if (!allEntry) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const totalCount = allEntry?.length

  const filteredData = allEntry?.filter((item) => {
    const today = new Date().toISOString().slice(0, 10)
    const itemDate = new Date(item?.createdAt)
    const newdate = itemDate?.toISOString()?.slice(0, 10)

    return newdate === today
  })
  const todayCount = filteredData?.length

  const todayAppointment = await Appointment.find()
    .populate('visitor')
    .sort({ createdAt: -1 })
  if (!todayAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const filteredApnData = todayAppointment?.filter((item) => {
    const today = new Date().toISOString().slice(0, 10)
    const itemDate = new Date(item?.date)
    const newdate = itemDate?.toISOString()?.slice(0, 10)

    return newdate === today
  })

  const recentVisitor = await Visit.find()
    .populate('visitor')
    .sort({ createdAt: -1 })
    .limit(5)

  if (!recentVisitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const visitorCount = await Visitor.countDocuments()
  const apnCount = await Appointment.countDocuments()
  const passCount = await Pass.countDocuments()

  const allTypeCounts = {
    visitorCount,
    apnCount,
    passCount,
  }

  return {
    totalCount,
    todayCount,
    recentVisitor,
    filteredApnData,
    allTypeCounts,
  }
}
