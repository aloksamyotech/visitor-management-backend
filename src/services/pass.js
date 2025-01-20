import { Pass } from '../models/pass.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const createPass = async (req) => {
  const {
    visitor,
    duration,
    startDate,
    endDate,
    setAccess,
    maxCount,
    maxEntryPerDay,
    comment,
  } = req?.body || {}

  const { userid } = req?.user || {} //fetching employee id

  if (!visitor || !userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const isExist = await Pass.findOne({ visitor: visitor })
  if (isExist) {
    return new CustomError(
      statusCodes?.conflict,
      Message?.alreadyExist,
      errorCodes?.already_exist
    )
  }

  const passCode = Math.floor(10000 + Math.random() * 90000)
  const newPass = await Pass.create({
    visitor,
    employee: userid,
    passCode,
    duration,
    startDate,
    endDate,
    setAccess,
    maxCount,
    maxEntryPerDay,
    comment,
  })
  if (!newPass) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newPass }
}

export const updatePassValidity = async (req) => {
  const { passId } = req?.params || {}
  const { startDate, endDate } = req?.body || {}

  const checkPass = await Pass.findById(passId)

  if (checkPass) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  const passUpdate = await Pass.findByIdAndUpdate(
    passId,
    { startDate, endDate },
    { new: true }
  )

  if (!passUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { passUpdate }
}

export const getAllPass = async () => {
  const allPass = await Pass.find().populate('visitor').sort({ createdAt: -1 })
  if (!allPass) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allPass }
}

export const getPassByPassCode = async (req) => {
  const { input } = req?.params || {}
  if (!input) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const passDetails = await Pass.findOne({ passCode: input }).populate(
    'visitor'
  )
  if (!passDetails) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return passDetails
}

export const getPassByName = async (req) => {
  const { inputName } = req?.query || {}
  if (!inputName) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const pass = await Pass.find().populate({
    path: 'visitor',
    match: { firstName: inputName },
    select: 'firstName',
  })

  const filteredPass = pass.filter((checks) => checks.visitor)

  if (filteredPass.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return filteredPass
}
