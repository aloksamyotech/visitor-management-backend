import { Payment } from '../models/paymentHistory.js'

export const createPaymentFunction = async (data) => {
  const { companyId, subscriptionId } = data || {}
  await Payment.create({
    companyId,
    subscriptionId,
    paymentStatus: 'completed',
  })
}

export const createPayment = async (req) => {
  const { companyId, subscriptionId } = req?.body || {}
  await Payment.create({
    companyId,
    subscriptionId,
    paymentStatus: '',
  })
}

export const getAllPaymentHistory = async () => {
  const getAllPaymentHistory = await Payment.find().populate([
    { path: 'companyId' },
    { path: 'subscriptionId' },
  ])
  return getAllPaymentHistory
}

export const companyPaymentHistory = (req) => {
  const { companyid } = req?.params || {}
  const companyPaymentHistory = Payment.find({ companyId: companyid }).populate(
    'subscriptionId'
  )
  return companyPaymentHistory
}
