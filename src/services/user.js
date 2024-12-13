import { User } from "../models/user.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";

export const registerUser = async (req) => {
  const { prefix, firstName, lastName, password, gender, phoneNumber, emailAddress, file, role, address } = req.body;

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
    address
  });

  const createdUser = await User.findById(user._id).select("-password");
  console.log(createdUser);


  if (!createdUser) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
    );
  }
  return createdUser;
};

export const loginUser = async (req) => {
  const { emailAddress, password } = req.body;

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

  const options = {
    httpOnly: true,
    secure: true,
  };

  return {
    options,
    loginUser
  };
};