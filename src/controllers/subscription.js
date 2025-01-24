import * as subscriptionService from '../services/subscription.js'
import { statusCodes } from '../core/common/constant.js'

export const createSubscription = async (req, res, next) => {
  const createSubscription = await subscriptionService.createSubscription(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(createSubscription)
}

export const updateSubscription = async (req, res, next) => {
  const updateSubscription = await subscriptionService.updateSubscription(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(updateSubscription)
}

export const getAllSubscription = async (req, res, next) => {
  const getAllSubscription = await subscriptionService.getAllSubscription(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getAllSubscription)
}
