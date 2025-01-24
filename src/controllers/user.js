import * as userService from '../services/user.js'
import { statusCodes } from '../core/common/constant.js'

export const userRegistration = async (req, res, next) => {
  const userData = await userService.registerUser(req, res, next)
  res.status(statusCodes?.ok).send(userData)
}

export const userLogin = async (req, res, next) => {
  const data = await userService.loginUser(req, res, next)
  res.status(statusCodes?.ok).send(data)
}

export const userDetails = async (req, res, next) => {
  const userDetails = await userService.getUserDetails(req, res, next)
  res.status(statusCodes?.ok).send(userDetails)
}

export const getUserDetailsById = async (req, res, next) => {
  const getUserDetailsById = await userService.getUserDetailsById(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(getUserDetailsById)
}

export const userUpdate = async (req, res, next) => {
  const updatedDetails = await userService.updateUserDetails(req, res, next)
  res.status(statusCodes?.ok).send(updatedDetails)
}

export const logoUpdate = async (req, res, next) => {
  const logoUpdate = await userService.logoUpdate(req, res, next)
  res.status(statusCodes?.ok).send(logoUpdate)
}

export const updateUserPassword = async (req, res, next) => {
  const updateUserPassword = await userService.updateUserPassword(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(updateUserPassword)
}

export const manageUserPermission = async (req, res, next) => {
  const manageUserPermission = await userService.manageUserPermission(
    req,
    res,
    next
  )
  res.status(statusCodes?.ok).send(manageUserPermission)
}

export const getAllUser = async (req, res, next) => {
  const getAllUser = await userService.getAllUser(req, res, next)
  res.status(statusCodes?.ok).send(getAllUser)
}

export const getAllCompany = async (req, res, next) => {
  const getAllCompany = await userService.getAllCompany(req, res, next)
  res.status(statusCodes?.ok).send(getAllCompany)
}
