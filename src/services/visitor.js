import { Visitor } from "../models/visitor.js";
import { VisitorHistory } from "../models/visitorHistory.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";
import { addColors } from "winston";

export const createVisitor = async (req) => {
  const {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    file,
    address,
    comment,
  } = req?.body;

  const { userid } = req?.user;

  const isVisitorEmailAlreadyExist = await Visitor.findOne({ emailAddress });
  if (isVisitorEmailAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.emailAlreadyRegistered,
      errorCodes?.email_already_registered,
    );
  }

  const isVisitorNumberAlreadyExist = await Visitor.findOne({ phoneNumber });
  if (isVisitorNumberAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.phoneNumberAlreadyRegistered,
      errorCodes?.phone_number_already_registered,
    );
  }

  const visitor = await Visitor.create({
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    file,
    comment,
    createdBy: userid,
  });

  const createdVisitor = await Visitor.findById(visitor._id);
  if (!createdVisitor) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
    );
  }

  const visitoryHistory = await VisitorHistory.create({ visitor: visitor._id });
  if (!visitoryHistory) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated,
      errorCodes?.not_found,
    );
  }

  return { createdVisitor };
};

export const updateVisitor = async (req) => {
  const { visitorid } = req?.headers;
  const {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    comment,
    createdBy,
  } = req?.body;

  const visitor = await Visitor.findById(visitorid);

  if (!visitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  const updatedData = await Visitor.findByIdAndUpdate(visitorid, {
    prefix,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    comment,
    createdBy,
  });
  return { updatedData };
};

export const getVisitorDetails = async (req) => {
  const { visitorid } = req?.params;

  if (!visitorid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const visitorData = await Visitor.findById(visitorid);

  if (!visitorData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  return { visitorData };
};

export const getAllVisitor = async (req) => {
  const allVisitors = await Visitor.find().sort({ createdAt: -1 });

  return { allVisitors };
};

export const getDetailsByNumber = async (req) => {
  const { input } = req?.params;

  if (!input) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const visitor = await Visitor.findOne({ phoneNumber: input });

  if (!visitor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.user_not_found,
    );
  }
  return { visitor };
};

export const getVisitorHistory = async (req) => {
  const { visitorid } = req?.params;

  if (!visitorid) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const visitorHistory = await VisitorHistory.findOne({ visitor: visitorid })
    .select("visitHistory")
    .populate({
      path: "visitHistory",
      populate: "appointmentId",
    });

  if (!visitorHistory) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  return { visitorHistory };
};

export const newVisitor = async (data) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy,
  } = data;

  const isVisitorEmailAlreadyExist = await Visitor.findOne({ emailAddress });
  if (isVisitorEmailAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.alreadyExist,
      errorCodes?.already_exist,
    );
  }
  const isVisitorNumberAlreadyExist = await Visitor.findOne({ phoneNumber });
  if (isVisitorNumberAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.alreadyExist,
      errorCodes?.already_exist,
    );
  }
  const visitor = await Visitor.create({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    visitorType,
    identityType,
    identityNumber,
    gender,
    address,
    createdBy,
  });

  const visitoryHistory = await VisitorHistory.create({ visitor: visitor._id });
  if (!visitoryHistory) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated,
      errorCodes?.not_found,
    );
  }

  return visitor;
};
