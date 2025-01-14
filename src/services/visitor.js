import { Visitor } from '../models/visitor.js'
import { VisitorHistory } from '../models/visitorHistory.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

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

export const getAllVisitor = async () => {
  const allVisitors = await Visitor.find().sort({ createdAt: -1 })
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
      populate: [{ path: 'appointmentId' }, { path: 'passId' }],
    })
    .sort({ createdAt: -1 })

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
  } = data

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
