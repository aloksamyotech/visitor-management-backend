import { Subscription } from '../models/subscription.js'
import { User } from '../models/user.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import moment from 'moment'

export const createSubscription = async (req) => {
  const { title, description, duration, price } = req?.body || {}

  const newSubscription = await Subscription.create({
    title,
    description,
    duration,
    price,
  })

  if (!newSubscription) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return newSubscription
}

export const updateSubscription = async (req) => {

  const { id } = req?.params || {}
  const { title, description, duration, price } = req?.body || {}
  if (!id) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const check = await Subscription.findById(id)
  if (!check) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const UpdatedData = await Subscription.findByIdAndUpdate(
    id,
    {
      title,
      description,
      duration,
      price,
    },
    { new: true }
  )

  if (!UpdatedData) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated,
      errorCodes?.not_updated
    )
  }
  return UpdatedData
}

export const getAllSubscription = async () => {
  const allSubscription = await Subscription.find().sort({ createdAt: -1 })
  if (!allSubscription) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return allSubscription
}

export const upgradeCompanySubscription = async (req) => {

  const { companyId, subscriptionId } = req?.body || {}
  if (!companyId || !subscriptionId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const subscription = await Subscription.findById({ _id: subscriptionId })
  if (!subscription) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const expiryDate = moment().add(subscription?.duration, "days").toDate()
  const updatedUser = await User.findByIdAndUpdate(
    companyId,
    {
      subscriptionDetails: subscriptionId,
      expiryDate,
      active: true
    },
    { new: true }
  )
  if (!updatedUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  subscription.company += 1
  await subscription.save()
  return updatedUser
}

export const updateSubscriptionActiveStatus = async (req) => {

  const { id } = req?.body || {}
  if (!id) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const subscription = await Subscription.findById(id)
  if (!subscription) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const status = subscription.active
  const updatedStatus = await Subscription.findByIdAndUpdate(id, { active: !status }, { new: true })
  if (!updatedStatus) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return updatedStatus
}