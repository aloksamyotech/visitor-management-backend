import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";
import { Visit } from "../models/visits.js";
import { VisitorHistory } from "../models/visitorHistory.js"
export const createEntry = async (req) => {
  const { visitor, duration, purpose, relatedTo, comment, visitorType, visitorTypeId } =
    req?.body;
  const { userid } = req?.user; //fetching employee id

  if (!visitor || !userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    purpose,
    relatedTo,
    comment,
    visitorType,
    visitorTypeId
  });

  if (!entryData) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
    );
  }
  const updateLogsInHistory = await VisitorHistory.findByIdAndUpdate(visitor, { $push: { visitHistory: entryData._id } });
  if (!updateLogsInHistory) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated,
      errorCodes?.not_found,
    );
  }

  return { entryData };
};
export const exitVisitor = async (req) => {
  const { visitid } = req?.headers;

  if (!visitid) {
    throw new CustomError(
      statusCodes?.badRequest,
      "Visitor ID is required.",
      errorCodes?.invalid_input,
    );
  }
  const visit = await Visit.findById(visitid);
  if (!visit) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  visit.active = false;
  visit.exitTime = new Date();
  await visit.save();

  return { visit };
};
export const getAllEntry = async (req) => {
  const allEntry = await Visit.find();
  return { allEntry };
};
