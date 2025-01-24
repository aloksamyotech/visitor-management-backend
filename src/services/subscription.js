import { Subscription } from '../models/subscription.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

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

  const check = await Subscription.findById(id)

  if (check) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
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
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
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
