import { Payment } from '../models/paymentHistory.js'
import { Message, errorCodes, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const createPaymentFunction = async (data) => {
  const { companyId, subscriptionId } = data || {}
  if (!companyId || !subscriptionId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const payment = await Payment.create({
    companyId,
    subscriptionId,
    paymentStatus: 'completed',
  })
  if (!payment) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }
}

export const createPayment = async (req) => {
  const { companyId, packageId, transactionId, paymentMethod } = req?.body || {}

  if (!companyId || !packageId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const payment = await Payment.create({
    companyId,
    subscriptionId: packageId,
    transactionId,
    paymentType: paymentMethod,
    paymentStatus: 'completed',
  })

  if (!payment) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }
  return payment
}

export const getAllPaymentHistory = async () => {
  const getAllPaymentHistory = await Payment.find()
    .populate([{ path: 'companyId' }, { path: 'subscriptionId' }])
    .sort({ createdAt: -1 })

  if (!getAllPaymentHistory) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return getAllPaymentHistory
}

export const companyPaymentHistory = (req) => {
  const { companyid } = req?.params || {}
  if (!companyid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const companyPaymentHistory = Payment.find({ companyId: companyid }).populate(
    'subscriptionId'
  )
  if (!companyPaymentHistory) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return companyPaymentHistory
}
