import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { Visit } from '../models/visits.js'
import { User } from '../models/user.js'
import { Subscription } from '../models/subscription.js'
import { VisitorHistory } from '../models/visitorHistory.js'
import { newVisitor } from './visitor.js'
import { Visitor } from '../models/visitor.js'
import { Appointment } from '../models/appointment.js'
import { Pass } from '../models/pass.js'
import { newApn } from './appointment.js'
import { newPass } from './pass.js'

export const createEntry = async (req) => {
  const {
    duration,
    comment,
    reference,
    entryType,
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
  const { user } = req?.user || {}
  const companyId = user?.companyId

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
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

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    comment,
    relatedTo: reference,
    entryType,
    companyId,
  })

  if (!entryData) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }
  const updateCount = await Visitor.findOne({ _id: visitor })
  if (!updateCount) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  if (updateCount) {
    updateCount.status = 'in'
    updateCount.totalVisit += 1
    await updateCount.save()
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
      Message?.visitHistoryNotCreated,
      errorCodes?.not_created
    )
  }

  return { entryData }
}

export const createEntryUsingApn = async (req) => {
  const {
    duration,
    comment,
    reference,
    entryType,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityNumber,
    identityType,
    gender,
    address,
    purpose,
    date,
    startTime,
    endTime,
  } = req?.body || {}
  let { visitor, appointmentId } = req?.body || {}
  const { userid } = req?.user || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
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

  const newApnData = {
    visitor,
    employee: userid,
    reference,
    purpose,
    date,
    startTime,
    endTime,
    comment,
    status: 'checkIn',
    companyId,
  }
  if (!appointmentId) {
    const newApnId = await newApn(newApnData)
    appointmentId = newApnId?._id
  }

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    comment,
    relatedTo: reference,
    entryType,
    appointmentId,
    companyId,
  })

  if (!entryData) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }
  const updateCount = await Visitor.findOne({ _id: visitor })
  if (!updateCount) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  if (updateCount) {
    updateCount.status = 'in'
    updateCount.totalVisit += 1
    await updateCount.save()
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
      Message?.visitHistoryNotCreated,
      errorCodes?.not_created
    )
  }

  if (appointmentId) {
    const updateAppointmentStatus = await Appointment.findByIdAndUpdate(
      { _id: appointmentId },
      { status: 'checkIn' }
    )
    if (!updateAppointmentStatus) {
      throw new CustomError(
        statusCodes?.badRequest,
        Message?.apnStatusNotUpdated,
        errorCodes?.not_updated
      )
    }
  }

  return { entryData }
}

export const createEntryUsingPass = async (req) => {
  const {
    duration,
    comment,
    reference,
    entryType,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityNumber,
    identityType,
    gender,
    address,
    setAccess,
    startDate,
    endDate,
  } = req?.body || {}

  let { visitor, passId } = req?.body || {}
  const { userid } = req?.user || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

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
    companyId,
  }

  if (!visitor) {
    const newVis = await newVisitor(data)
    visitor = newVis._id
  }

  const newPassData = {
    visitor,
    employee: userid,
    duration,
    startDate,
    endDate,
    setAccess,
    comment,
    companyId,
  }
  if (!passId) {
    const newPassId = await newPass(newPassData)
    passId = newPassId?._id
  }

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    comment,
    relatedTo: reference,
    entryType,
    passId,
    companyId,
  })

  if (!entryData) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }
  const updateCount = await Visitor.findOne({ _id: visitor })
  if (!updateCount) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  if (updateCount) {
    updateCount.status = 'in'
    updateCount.totalVisit += 1
    await updateCount.save()
  }

  if (passId) {
    const updatePassCount = await Pass.findOne({ _id: passId })
    if (!updatePassCount) {
      throw new CustomError(
        statusCodes?.notFound,
        Message?.passNotFound,
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
      Message?.visitHistoryNotCreated,
      errorCodes?.not_created
    )
  }

  return { entryData }
}

export const exitVisitor = async (req) => {
  const { visitid } = req?.params || {}

  if (!visitid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
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
  visit.status = false
  visit.exitTime = new Date()
  await visit.save()

  const updateVisitorStatus = visit?.visitor
  if (updateVisitorStatus) {
    await Visitor.findByIdAndUpdate(
      { _id: updateVisitorStatus },
      {
        status: 'out',
      }
    )
  }
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

export const getAllEntry = async (req) => {
  const { user } = req?.user || {}
  const companyId = user?.companyId

  const allentry = await Visit.find()
    .populate('visitor')
    .sort({ updatedAt: -1 })
  const allEntry = allentry.filter((entry) => entry?.companyId == companyId)

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
  const { user } = req?.user || {}
  const companyId = user?.companyId
  const { startDate, endDate } = req?.query || {}

  const allentry = await Visit.find().populate('visitor')
  const allEntry = allentry.filter((entry) => entry?.companyId == companyId)
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

export const getDashboardData = async (req) => {
  const { user } = req?.user || {}
  const companyId = user?.companyId

  const allentry = await Visit.find()
  const allEntry = allentry.filter((entry) => entry?.companyId == companyId)

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

  const todayApt = await Appointment.find()
    .populate('visitor')
    .sort({ createdAt: -1 })
  const todayAppointment = todayApt.filter((apt) => apt?.companyId == companyId)

  if (!todayAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const filteredApnData = todayAppointment
    ?.filter((item) => {
      const today = new Date().toISOString().slice(0, 10)
      const itemDate = new Date(item?.date)
      const newdate = itemDate?.toISOString()?.slice(0, 10)

      return newdate === today
    })
    ?.slice(0, 5)

  const recentvisitor = await Visit.find()
    .populate('visitor')
    .sort({ createdAt: -1 })
  const recentVisitor = recentvisitor
    ?.filter((recent) => recent?.companyId == companyId)
    .slice(0, 5)

  if (!recentVisitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const visitorcount = await Visitor.find()
  const visitorCount = visitorcount.filter(
    (count) => count?.companyId == companyId
  ).length

  const apncount = await Appointment.find()
  const apnCount = apncount.filter(
    (count) => count?.companyId == companyId
  ).length

  const passcount = await Pass.find()
  const passCount = passcount.filter(
    (count) => count?.companyId == companyId
  ).length

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

export const adminDashboardData = async () => {
  const companycount = await User.find()
  const companyCount = companycount.filter(
    (company) => company.role == 'admin'
  ).length
  const visitorcount = await Visitor.find()
  const visitorCount = visitorcount.length
  const apncount = await Appointment.find()
  const apnCount = apncount.length
  const passcount = await Pass.find()
  const passCount = passcount.length

  const allTypeCount = {
    visitorCount,
    apnCount,
    passCount,
    companyCount,
  }
  return {
    allTypeCount,
  }
}

export const adminReport = async (req) => {
  const { startDate, endDate, companyId } = req?.query || {}

  const allentry = await Visit.find().populate('visitor')
  const allEntry = allentry.filter((entry) => entry?.companyId == companyId)
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

export const companyEmpCount = async () => {
  const companyEmpCount = User.find()
  return companyEmpCount
}

export const superAdminReport = async () => {

  const companycount = await User.find()
  const subscription = await Subscription.find()

  const companyCount = companycount.filter(
    (company) => company.role == 'admin'
  ).length
  const activeSubscription = subscription.filter(active => active?.active === true).length
  const totalSubscriptions = subscription.reduce((acc, curr) => acc + curr?.company, 0);
  const totalRevenue = subscription.reduce((acc, curr) => acc + (curr?.company * curr?.price), 0);

  const reprtData = {
    activeSubscription,
    totalSubscriptions,
    companyCount,
    totalRevenue
  }
  return reprtData
}