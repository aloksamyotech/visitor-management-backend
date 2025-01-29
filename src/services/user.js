import { User } from '../models/user.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { createToken } from '../core/helpers/createToken.js'
import process from 'node:process'
import { Subscription } from '../models/subscription.js'
import { createPaymentFunction } from './payment.js'

const checkUserExist = async (email, phone) => {
  const isEmail = await User.findOne({ emailAddress: email })
  const isPhone = await User.findOne({ phoneNumber: phone })
  if (isEmail) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.emailAlreadyRegistered,
      errorCodes?.email_already_registered
    )
  }
  if (isPhone) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.phoneNumberAlreadyRegistered,
      errorCodes?.phone_number_already_registered
    )
  }
}

export const registerUser = async (req) => {
  const {
    prefix,
    firstName,
    lastName,
    password,
    gender,
    phoneNumber,
    emailAddress,
    role,
    address,
    permissions,
  } = req?.body || {}
  const file = req?.file?.path
  const { userid } = req?.user || {}

  await checkUserExist(emailAddress, phoneNumber)

  const user = await User.create({
    prefix,
    firstName,
    lastName,
    password,
    gender,
    phoneNumber,
    emailAddress,
    file,
    role,
    address,
    companyId: role === 'admin' ? undefined : userid,
    permissions,
  })
  if (role === 'admin') {
    user.companyId = user._id

    const subscription = await Subscription.findOne({ title: 'Free Trial' })
    subscription.company += 1
    await subscription.save()

    const paymentData = {
      companyId: user._id,
      subscriptionId: subscription._id,
    }
    await createPaymentFunction(paymentData)

    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 1)

    user.subscriptionDetails = subscription._id
    user.startDate = new Date()
    user.expiryDate = expiryDate
    await user.save()
  }
  const createdUser = await User.findById(user._id).select('-password')

  if (!createdUser) {
    throw new CustomError(
      statusCodes?.internalServerError,
      Message?.notCreated,
      errorCodes?.not_created
    )
  }

  return { createdUser }
}

export const loginUser = async (req) => {
  const { emailAddress, password } = req?.body || {}

  const user = await User.findOne({ emailAddress })
  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.emailNotFound,
      errorCodes?.invalid_email
    )
  }

  const passwordVerify = await user.isPasswordCorrect(password)

  if (!passwordVerify) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.wrongPassword,
      errorCodes?.password_mismatch
    )
  }

  const loginUser = await User.findById(user._id).select('-password')
  const companyLogo = await User.findById(user._id)
    .select('companyId')
    .populate('companyId')

  const payload = {
    userid: loginUser?._id,
    user: loginUser,
    role: loginUser?.role,
    permission: loginUser?.permissions,
    logo: companyLogo?.companyId?.companyLogo,
  }
  const key = process.env?.ACCESS_TOKEN_SECRET
  const expiresIn = process.env?.ACCESS_TOKEN_EXPIRY

  const jwtToken = createToken(payload, key, expiresIn)

  const options = {
    httpOnly: true,
    secure: true,
  }

  return {
    options,
    loginUser,
    jwtToken,
  }
}

export const getUserDetails = async (req) => {
  const { userid } = req?.user || {}

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userIdNotFound,
      errorCodes?.user_not_found
    )
  }

  const userData = await User.findById(userid).select('-password')

  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotFound,
      errorCodes?.user_not_found
    )
  }
  return userData
}

export const updateUserDetails = async (req) => {
  const { userid } = req?.user || {}
  const {
    prefix,
    firstName,
    lastName,
    password,
    gender,
    phoneNumber,
    emailAddress,
    role,
    address,
  } = req?.body || {}
  const file = req?.file?.path
  const user = await User.findOne({ _id: userid })

  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }

  const updatedData = await User.findByIdAndUpdate(userid, {
    prefix,
    firstName,
    lastName,
    password,
    gender,
    phoneNumber,
    emailAddress,
    file,
    role,
    address,
  })
  return { updatedData }
}

export const logoUpdate = async (req) => {
  const { userid } = req?.user || {}
  const companyLogo = req?.file?.path
  const user = await User.findOne({ _id: userid })

  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }

  const updatedData = await User.findByIdAndUpdate(userid, {
    companyLogo,
  })
  return { updatedData }
}

export const manageUserPermission = async (req) => {
  const { userid } = req?.params || {}
  const permission = req?.body || {}

  const user = await User.findById(userid)
  const currentPermissions = user.permissions || []

  const allowedPermissions = Object.keys(permission).filter(
    (key) => permission[key] === true && !currentPermissions.includes(key)
  )
  const disallowedPermissions = Object.keys(permission).filter(
    (key) => permission[key] === false && currentPermissions.includes(key)
  )

  const addPermission = await User.findOneAndUpdate(
    { _id: userid },
    {
      $addToSet: { permissions: { $each: allowedPermissions } },
    },
    { new: true }
  )
  const removePermission = await User.findOneAndUpdate(
    { _id: userid },
    {
      $pull: { permissions: { $in: disallowedPermissions } },
    },
    { new: true }
  )
  return { addPermission, removePermission }
}

export const getAllUser = async (req) => {
  const { user } = req?.user || {}
  const companyId = user?.companyId

  const AllUser = await User.find().select('-password').sort({ createdAt: -1 })
  const allUser = AllUser.filter(
    (user) =>
      user?.role !== 'admin' &&
      user?.role !== 'superAdmin' &&
      user?.companyId == companyId
  )

  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allUser }
}

export const getAllCompany = async () => {
  const AllUser = await User.find().populate('subscriptionDetails').select('-password').sort({ createdAt: -1 })
  const allUser = AllUser.filter((user) => user?.role === 'admin')
  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allUser }
}

export const getUserDetailsById = async (req) => {
  const { userid } = req?.params || {}

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await User.findById(userid)
    .populate('subscriptionDetails')
    .select('-password')

  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return userData
}

export const updateUserPassword = async (req) => {
  const { userid } = req?.user || {}
  const { password, currentPassword } = req?.body || {}
  const user = await User.findOne({ _id: userid })
  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  const checkCurrentPassword = await user?.isPasswordCorrect(currentPassword)
  if (!checkCurrentPassword) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.incorrrectPassword,
      errorCodes?.password_mismatch
    )
  }
  const updatedData = await User.findByIdAndUpdate(userid, { password })

  return updatedData
}

export const updateActiveStatus = async (req) => {

  const { userid } = req?.body || {}
  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.user_not_found
    )
  }
  const user = await User.findById(userid)
  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotFound,
      errorCodes?.user_not_found
    )
  }
  const status = user.active
  const updatedStatus = await User.findByIdAndUpdate(userid, { active: !status }, { new: true })
  if (!updatedStatus) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return updatedStatus
}