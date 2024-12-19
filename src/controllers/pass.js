import * as passService from "../services/pass.js";
import { Message, statusCodes } from "../core/common/constant.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import CustomError from "../utils/exception.js";

export const createPass = async (req, res, next) => {
  const createPass = await passService.createPass(req, res, next);
  res.status(statusCodes?.created).send(createPass);
};

export const updatePassValidity = async (req, res, next) => {
  const updatePassValidity = await passService.updatePassValidity(
    req,
    res,
    next,
  );
  res.status(statusCodes?.ok).send(updatePassValidity);
};

export const getAllPass = async (req, res, next) => {
  const getAllPass = await passService.getAllPass(req, res, next);
  res.status(statusCodes?.ok).send(getAllPass);
};

export const getPassByPassCode = async (req, res, next) => {
  const getPassByPassCode = await passService.getPassByPassCode(req, res, next);
  res.status(statusCodes?.ok).send(getPassByPassCode);
};

export const getPassByName = async (req, res, next) => {
  const getPassByName = await passService.getPassByName(req, res, next);
  res.status(statusCodes?.ok).send(getPassByName);
};
