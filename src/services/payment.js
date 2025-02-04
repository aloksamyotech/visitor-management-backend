import { Payment } from '../models/paymentHistory.js'
import { Message, errorCodes, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Stripe from 'stripe'
import process from 'node:process'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

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

export const createCheckoutSession = async (req) => {
  const { items, userId } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Package Name: ${items?.title}`,
            description: `Duration: ${items.duration} |  Description: ${items.description}`,
          },
          unit_amount: items?.price * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { userId },
  })
  return session.id
}
