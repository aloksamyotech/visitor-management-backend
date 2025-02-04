import * as visitorService from '../services/visitor.js'
import { statusCodes } from '../core/common/constant.js'

export const createVisitor = async (req, res, next) => {
  const visitorData = await visitorService.createVisitor(req, res, next)
  res.status(statusCodes?.ok).send(visitorData)
}

export const updateVisitor = async (req, res, next) => {
  const updatedData = await visitorService.updateVisitor(req, res, next)
  res.status(statusCodes?.ok).send(updatedData)
}

export const getAllVisitor = async (req, res, next) => {
  const getAllVisitor = await visitorService.getAllVisitor(req, res, next)
  res.status(statusCodes?.ok).send(getAllVisitor)
}

export const getVisitorDetails = async (req, res, next) => {
  const getVisitorDetails = await visitorService.getVisitorDetails(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getVisitorDetails)
}

export const getDetailsByNumber = async (req, res, next) => {
  const getDetailsByNumber = await visitorService.getDetailsByNumber(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getDetailsByNumber)
}

export const getVisitorHistory = async (req, res, next) => {
  const getVisitorHistory = await visitorService.getVisitorHistory(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getVisitorHistory)
}

export const bulkUploadVisitor = async (req, res, next) => {
  const bulkUploadVisitor = await visitorService.bulkUploadVisitor(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(bulkUploadVisitor)
}
