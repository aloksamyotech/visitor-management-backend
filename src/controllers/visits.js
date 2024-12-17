import * as visitsService from "../services/visits.js";
import { statusCodes } from "../core/common/constant.js";

export const createEntry = async (req, res, next) => {
    const entryData = await visitsService.createEntry(req, res, next);
    res.status(statusCodes?.created).send(entryData);
};
export const exitVisitor = async (req, res, next) => {
    const exitVisitor = await visitsService.exitVisitor(req, res, next);
    res.status(statusCodes?.ok).send(exitVisitor);
};
export const getAllEntry = async (req, res, next) => {
    const getAllEntry = await visitsService.getAllEntry(req, res, next);
    res.status(statusCodes?.ok).send(getAllEntry);
};
