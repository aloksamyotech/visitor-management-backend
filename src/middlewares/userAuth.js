import jwt from 'jsonwebtoken'
import CustomError from '../utils/exception.js'
import {
  errorCodes,
  Message,
  statusCodes,
  checkRole,
} from '../core/common/constant.js'
import 'dotenv/config'
import process from 'node:process'

export const userAuth = (req, res, next) => {
  const { authorization } = req?.headers || {}
  const token = authorization && authorization.split(' ')[1]
  const verfifyToken = process.env?.ACCESS_TOKEN_SECRET

  if (!token) {
    throw new CustomError(
      statusCodes?.unauthorized,
      Message?.notFound,
      errorCodes?.missing_auth_token
    )
  }
  jwt.verify(token, verfifyToken, (err, user) => {
    if (err) {
      throw new CustomError(
        statusCodes?.unauthorized,
        Message?.inValid,
        errorCodes?.invalid_authentication
      )
    }
    req.user = user?.payload //attach decoded user data in req
    next()
  })
}

export const superAdminAuth = (req, res, next) => {
  const { role } = req?.user || {}

  if (role !== checkRole?.superAdmin) {
    throw new CustomError(
      statusCodes?.unauthorized,
      Message?.inValid,
      errorCodes?.access_denied
    )
  }
  next()
}

export const adminAuth = (req, res, next) => {
  const { role } = req?.user || {}

  if (role !== checkRole?.admin &&
    role !== checkRole?.superAdmin
  ) {
    throw new CustomError(
      statusCodes?.unauthorized,
      Message?.inValid,
      errorCodes?.access_denied
    )
  }
  next()
}
export const employeeAuth = (req, res, next) => {
  const { role } = req?.user || {}

  if (
    role !== checkRole?.superAdmin &&
    role !== checkRole?.admin &&
    role !== checkRole?.hr &&
    role !== checkRole?.guard &&
    role !== checkRole?.security &&
    role !== checkRole?.receptionist
  ) {
    throw new CustomError(
      statusCodes?.unauthorized,
      Message?.inValid,
      errorCodes?.access_denied
    )
  }
  next()
}
