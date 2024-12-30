import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";
import { Visit } from "../models/visits.js";
import { VisitorHistory } from "../models/visitorHistory.js";
import { newVisitor } from "./visitor.js";
import { Visitor } from "../models/visitor.js";
export const createEntry = async (req) => {
  const {
    duration,
    comment,
    reference,
    entryType,
    appointmentId,
    passId,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityNumber,
    identityType,
    gender,
    address,

  } = req?.body;

  let { visitor } = req?.body;
  const { userid } = req?.user; //fetching employee id
  if (!userid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const data = {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy: userid
  }

  if (!visitor) {
    const newVis = await newVisitor(data);
    visitor = newVis._id;
  }

  const entryData = await Visit.create({
    visitor,
    employee: userid,
    duration,
    comment,
    relatedTo: reference,
    entryType,
    appointmentId,
    passId
  });

  if (!entryData) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
    );
  }
  if (visitor) {
    const updateCount = await Visitor.findOne({ _id: visitor });
    if (updateCount) {
      updateCount.totalVisit += 1;
      await updateCount.save();
    }
  }
  const updateLogsInHistory = await VisitorHistory.findByIdAndUpdate(visitor, {
    $push: { visitHistory: entryData._id },
  });
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
  const allEntry = await Visit.find().populate("visitor");
  return { allEntry };
};
