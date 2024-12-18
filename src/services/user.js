import { User } from "../models/user.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";
import { createToken } from '../core/helpers/createToken.js'

export const registerUser = async (req) => {
  const { prefix, firstName, lastName, password, gender, phoneNumber, emailAddress, file, role, address, salary } = req?.body;

  const isUserAlreadyExist = await User.findOne({ emailAddress });
  if (isUserAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.alreadyExist,
      errorCodes?.already_exist,
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
    salary
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
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
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const passwordVerify = await user.isPasswordCorrect(password);

  if (!passwordVerify) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.inValid,
      errorCodes?.invalid_credentials,
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
    jwtToken
  };
};

export const getUserDetails = async (req) => {

  const { userid } = req?.user;

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
}

export const updateUserDetails = async (req) => {
  const { userid } = req?.user;
  const { prefix, firstName, lastName, password, gender, phoneNumber, emailAddress, file, role, address } = req?.body;

  const user = await User.findById(userid);

  if (!user) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }

  const updatedData = await User.findByIdAndUpdate(userid, { prefix, firstName, lastName, password, gender, phoneNumber, emailAddress, file, role, address })
  return { updatedData }
}