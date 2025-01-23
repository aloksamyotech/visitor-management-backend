import { Visitor } from '../models/visitor.js'
import { VisitorHistory } from '../models/visitorHistory.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import XLSX from 'xlsx'

const checkVisitorExist = async (email, phone) => {
  const isPhone = await Visitor.findOne({ phoneNumber: phone })
  if (isPhone) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.phoneNumberAlreadyRegistered,
      errorCodes?.phone_number_already_registered
    )
  }
}

export const createVisitor = async (req) => {
  const {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    comment,
  } = req?.body || {}
  const file = req?.file?.path
  const { userid } = req?.user || {}
  const { user } = req?.user || {}
  const companyId = user?.companyId

  await checkVisitorExist(emailAddress, phoneNumber)

  const visitor = await Visitor.create({
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    file,
    comment,
    createdBy: userid,
    companyId,
  })

  if (!visitor) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }

  const visitoryHistory = await VisitorHistory.create({ visitor: visitor._id })
  if (!visitoryHistory) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.visitHistoryNotCreated,
      errorCodes?.not_created
    )
  }

  return { visitor }
}

export const updateVisitor = async (req) => {
  const { visitorid } = req?.headers || {}
  const {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    comment,
    createdBy,
  } = req?.body || {}

  const visitor = await Visitor.findById(visitorid)

  if (!visitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updatedData = await Visitor.findByIdAndUpdate(visitorid, {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    comment,
    createdBy,
  })

  if (!updatedData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { updatedData }
}

export const getVisitorDetails = async (req) => {
  const { visitorid } = req?.params || {}

  if (!visitorid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const visitorData = await Visitor.findById(visitorid)

  if (!visitorData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { visitorData }
}

export const getAllVisitor = async (req) => {
  const { user } = req?.user || {}
  const companyId = user?.companyId
  const allvisitors = await Visitor.find().sort({ createdAt: -1 })
  const allVisitors = allvisitors.filter(
    (visitor) => visitor?.companyId == companyId
  )
  if (!allVisitors) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  return { allVisitors }
}

export const getDetailsByNumber = async (req) => {
  const { input } = req?.params || {}

  if (!input) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const visitor = await Visitor.findOne({ phoneNumber: input })

  if (!visitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.user_not_found
    )
  }
  return { visitor }
}

export const getVisitorHistory = async (req) => {
  const { visitorid } = req?.params || {}

  if (!visitorid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const visitorHistory = await VisitorHistory.findOne({ visitor: visitorid })
    .select('visitHistory')
    .populate({
      path: 'visitHistory',
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: 'appointmentId' },
        { path: 'passId' },
        { path: 'relatedTo' },
      ],
    })

  if (!visitorHistory) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { visitorHistory }
}

export const newVisitor = async (data) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy,
    companyId,
  } = data || {}

  await checkVisitorExist(emailAddress, phoneNumber)

  const visitor = await Visitor.create({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy,
    companyId,
  })

  if (!visitor) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }

  const visitoryHistory = await VisitorHistory.create({ visitor: visitor._id })
  if (!visitoryHistory) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.visitHistoryNotCreated,
      errorCodes?.not_created
    )
  }

  return visitor
}

export const bulkUploadVisitor = async (req) => {
  const file = req?.file?.path
  const { userid } = req?.user || {}

  const workbook = XLSX.readFile(file)
  const sheetName = workbook.SheetNames[0]
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

  const visitors = data.map((row) => ({
    ...row,
    createdBy: userid,
  }))

  const keysToCheck = [
    'firstName',
    'phoneNumber',
    'identityNumber',
    'identityType',
    'gender',
    'address',
  ]
  const checkAllKeys = visitors.every((obj) =>
    keysToCheck.every((key) => key in obj)
  )
  if (!checkAllKeys) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.inValidData,
      errorCodes?.invalid_format
    )
  }

  visitors.map(async (visitor) => {
    try {
      const newVisitor = await Visitor.create(visitor)
      if (!newVisitor) {
        throw new CustomError(
          statusCodes?.badRequest,
          Message?.notCreated,
          errorCodes?.not_created
        )
      }

      const visitoryHistory = await VisitorHistory.create({
        visitor: newVisitor._id,
      })
      if (!visitoryHistory) {
        return new CustomError(
          statusCodes?.badRequest,
          Message?.visitHistoryNotCreated,
          errorCodes?.not_created
        )
      }
    } catch (error) {
      //handles duplicate visitor
    }
  })
  return
}
