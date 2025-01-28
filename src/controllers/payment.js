import * as paymentService from '../services/payment.js'
import { statusCodes } from '../core/common/constant.js'

export const createPayment = async (req, res, next) => {
  const createPayment = await paymentService.createPayment(req, res, next)
  res.status(statusCodes?.ok).send(createPayment)
}

export const getAllPaymentHistory = async (req, res, next) => {
  const getAllPaymentHistory = await paymentService.getAllPaymentHistory(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAllPaymentHistory)
}

export const companyPaymentHistory = async (req, res, next) => {
  const companyPaymentHistory = await paymentService.companyPaymentHistory(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(companyPaymentHistory)
}
