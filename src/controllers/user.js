import * as userService from "../services/user.js";
import { Message, statusCodes } from "../core/common/constant.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import CustomError from "../utils/exception.js";

export const userRegistration = async (req, res, next) => {
  console.log("userdata",req?.body)
  const userData = await userService.registerUser(req, res, next);
  res.status(statusCodes?.created).send(userData);
};

export const userLogin = async (req, res, next) => {
  const data = await userService.loginUser(req, res, next);
  res.status(statusCodes?.ok).send(data?.loginUser);
};
