import { User } from "../models/user.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";
import { createToken } from "../core/helpers/createToken.js";

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
  } = req?.body;
  const file = req?.file;
  console.log(file);

  const isUserEmailAlreadyExist = await User.findOne({ emailAddress });
  if (isUserEmailAlreadyExist) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.emailAlreadyRegistered,
      errorCodes?.email_already_registered,
    );
  }

  const isUserNumberAlreadyExist = await User.findOne({ phoneNumber });
  if (isUserNumberAlreadyExist) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.phoneNumberAlreadyRegistered,
      errorCodes?.phone_number_already_registered,
    );
  }

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
  });
  console.log("================", user);

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return new CustomError(
      statusCodes?.internalServerError,
      Message?.notCreated,
      errorCodes?.not_created,
    );
  }

  return { createdUser };
};

export const loginUser = async (req) => {
  const { emailAddress, password } = req?.body;

  const user = await User.findOne({ emailAddress });
  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.emailNotFound,
      errorCodes?.invalid_email,
    );
  }

  const passwordVerify = await user.isPasswordCorrect(password);

  if (!passwordVerify) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.wrongPassword,
      errorCodes?.password_mismatch,
    );
  }

  const loginUser = await User.findById(user._id).select("-password");

  const payload = { userid: loginUser._id, role: loginUser.role };
  const key = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

  const jwtToken = createToken(payload, key, expiresIn);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return {
    options,
    loginUser,
    jwtToken,
  };
};

export const getUserDetails = async (req) => {
  const { userid } = req?.user;

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userIdNotFound,
      errorCodes?.user_not_found,
    );
  }

  const userData = await User.findById(userid).select("-password");

  if (!userData) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.userNotFound,
      errorCodes?.user_not_found,
    );
  }
  return userData;
};

export const updateUserDetails = async (req) => {
  const { userid } = req?.user;
  const {
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
  } = req?.body;

  const user = await User.findOne({ _id: userid });

  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
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
  });
  return { updatedData };
};

export const manageUserPermission = async (req) => {
  const { userid } = req?.params;
  const { permissions } = req?.body;

  const user = await User.findById(userid);

  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }

  if (!permissions) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const updatePermission = await User.findByIdAndUpdate(
    userid,
    { permissions },
    { new: true },
  );
  if (!updatePermission) {
    throw new CustomError(
      statusCodes?.notModified,
      Message?.notUpdate,
      errorCodes?.operation_failed,
    );
  }
  return updatePermission;
};

export const getAllUser = async (req) => {
  const allUser = await User.find().select("-password").sort({ createdAt: -1 });
  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  return { allUser };
};

export const getUserDetailsById = async (req) => {
  const { userid } = req?.params;

  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const userData = await User.findById(userid).select("-password");

  if (!userData) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  return userData;
};
