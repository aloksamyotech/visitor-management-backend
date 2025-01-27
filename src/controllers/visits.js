import * as visitsService from '../services/visits.js'
import { statusCodes } from '../core/common/constant.js'

export const createEntry = async (req, res, next) => {
  const entryData = await visitsService.createEntry(req, res, next)
  res.status(statusCodes?.ok).send(entryData)
}

export const createEntryUsingApn = async (req, res, next) => {
  const entryData = await visitsService.createEntryUsingApn(req, res, next)
  res.status(statusCodes?.ok).send(entryData)
}

export const createEntryUsingPass = async (req, res, next) => {
  const entryData = await visitsService.createEntryUsingPass(req, res, next)
  res.status(statusCodes?.ok).send(entryData)
}

export const exitVisitor = async (req, res, next) => {
  const exitVisitor = await visitsService.exitVisitor(req, res, next)
  res.status(statusCodes?.ok).send(exitVisitor)
}
export const getAllEntry = async (req, res, next) => {
  const getAllEntry = await visitsService.getAllEntry(req, res, next)
  res.status(statusCodes?.ok).send(getAllEntry)
}
export const getEntryByDate = async (req, res, next) => {
  const getEntryByDate = await visitsService.getEntryByDate(req, res, next)
  res.status(statusCodes?.ok).send(getEntryByDate)
}
export const getDashboardData = async (req, res, next) => {
  const getDashboardData = await visitsService.getDashboardData(req, res, next)
  res.status(statusCodes?.ok).send(getDashboardData)
}

export const adminDashboardData = async (req, res, next) => {
  const adminDashboardData = await visitsService.adminDashboardData(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(adminDashboardData)
}

export const adminReport = async (req, res, next) => {
  const adminReport = await visitsService.adminReport(req, res, next)
  res.status(statusCodes?.ok).send(adminReport)
}

export const companyEmpCount = async (req, res, next) => {
  const companyEmpCount = await visitsService.companyEmpCount(req, res, next)
  res.status(statusCodes?.ok).send(companyEmpCount)
}
