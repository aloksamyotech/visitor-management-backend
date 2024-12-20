import { Visitor } from "../models/visitor.js";
import { VisitorHistory } from "../models/visitorHistory.js"
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";

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
    address,
    comment,
  } = req?.body;
  const { userid } = req?.user;
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

  const visitoryHistory = await VisitorHistory.create({ visitor: visitor._id })
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
  const allVisitors = await Visitor.find();

  return { allVisitors };
};

export const getDetailsByNumber = async (req) => {
  const { phoneNumber } = req?.body;

  if (!phoneNumber) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }

  const visitor = await Visitor.findOne({ phoneNumber });

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

  const visitorHistory = await VisitorHistory.find({ visitor: visitorid }).select("visitHistory").populate("visitHistory");

  if (!visitorHistory) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  return { visitorHistory };

}