import * as userService from "../services/user.js";
import { Message, statusCodes } from "../core/common/constant.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import CustomError from "../utils/exception.js";

export const userRegistration = async (req, res, next) => {
  const userData = await userService.registerUser(req, res, next);
  res.status(statusCodes?.created).send(userData);
};

export const userLogin = async (req, res, next) => {
  const data = await userService.loginUser(req, res, next);
  res.status(statusCodes?.found).send(data);
};

export const userDetails = async (req, res, next) => {
  const userDetails = await userService.getUserDetails(req, res, next);
  res.status(statusCodes?.found).send(userDetails);
};

export const userUpdate = async (req, res, next) => {
  const updatedDetails = await userService.updateUserDetails(req, res, next);
  res.status(statusCodes?.ok).send(updatedDetails);
};
