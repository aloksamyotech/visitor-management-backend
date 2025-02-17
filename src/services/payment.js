import { Payment } from '../models/paymentHistory.js'
import { Subscription } from '../models/subscription.js'
import {
  Message,
  errorCodes,
  statusCodes,
  urls,
} from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Stripe from 'stripe'
import process from 'node:process'
import { upgradeCompanySubscriptionFunction } from './subscription.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createPaymentFunction = async (data) => {
  const {
    companyId,
    subscriptionId,
    paymentStatus,
    transactionId,
    paymentType,
  } = data || {}
  if (!companyId || !subscriptionId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const subscriptionDetails = await Subscription.findById(subscriptionId)
  if (!subscriptionDetails) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const payment = await Payment.create({
    companyId,
    subscriptionId,
    price: subscriptionDetails?.price,
    paymentStatus,
    transactionId,
    paymentType,
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

export const createPayment = async (req) => {
  const { companyId, packageId, transactionId, paymentMethod } = req?.body || {}

  if (!companyId || !packageId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const subscriptionDetails = await Subscription.findById(packageId)
  if (!subscriptionDetails) {
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
    price: subscriptionDetails?.price,
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
  const companyPaymentHistory = Payment.find({ companyId: companyid })
    .populate('subscriptionId')
    .sort({ createdAt: -1 })
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
  const { items } = req?.body || {}
  const { userid } = req?.user || {}

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Package Name: ${items?.title}`,
            description: `Duration: ${items?.duration} |  Description: ${items?.description}`,
          },
          unit_amount: items?.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      subscriptionId: items?.id,
      userid: userid,
    },
    success_url: `${urls?.success}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: urls?.cancel,
  })

  await Payment.create({
    companyId: userid,
    subscriptionId: items?.id,
    price: items?.price,
    paymentStatus: 'pending',
    sessionId: session.id,
  })

  return session.id
}

export const getCheckoutSessionDetails = async (req) => {
  const { sessionId } = req.params
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  })
  const data = {
    companyId: session?.metadata?.userid,
    subscriptionId: session?.metadata?.subscriptionId,
    paymentStatus: session?.payment_intent?.status,
    transactionId: session?.payment_intent?.id,
    paymentType: session?.payment_intent?.payment_method_types[0],
    amount: session?.amount_total,
  }
  await createPaymentFunction(data)
  await upgradeCompanySubscriptionFunction(data)

  return data
}

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    await Payment.findOneAndUpdate(
      { sessionId: session.id },
      { $set: { paymentStatus: 'completed' } }
    )
  } else if (
    event.type === 'checkout.session.async_payment_failed' ||
    event.type === 'payment_intent.payment_failed'
  ) {
    const session = event.data.object
    await Payment.findOneAndUpdate(
      { sessionId: session.id },
      { $set: { paymentStatus: 'cancelled' } }
    )
  }
  res.json({ received: true })
}

export const getPaymentHistoryById = async (req) => {
  const { id } = req?.params || {}

  const getPaymentHistoryById = await Payment.findById(id)
    .populate('companyId')
    .populate('subscriptionId')

  if (!getPaymentHistoryById) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return getPaymentHistoryById
}
