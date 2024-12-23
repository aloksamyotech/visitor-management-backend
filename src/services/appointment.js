import { Appointment } from "../models/appointment.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";

export const scheduleAppointment = async (req) => {
  const {
    visitor,
    purpose,
    duration,
    date,
    startTime,
    endTime,
    ref,
    comment,
    appointmentId,
  } = req?.body;

  const { userid } = req?.user; //fetching employee id

  if (!visitor || !userid || !ref) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const newAppointment = await Appointment.create({
    visitor,
    employee: userid,
    purpose,
    duration,
    date,
    startTime,
    endTime,
    ref,
    appointmentId,
    comment,
  });
  if (!newAppointment) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request,
    );
  }
  return { newAppointment };
};

export const reScheduleAppointment = async (req) => {
  const { appointmentId } = req?.params;
  const { date, startTime, endTime } = req?.body;

  const checkAppointment = await Appointment.findById(appointmentId);

  if (!checkAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  const updatedData = await Appointment.findByIdAndUpdate(
    appointmentId,
    { date, startTime, endTime },
    { new: true },
  );

  if (!updatedData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }

  return { updatedData };
};

export const updateAppointmentStatus = async (req) => {
  const { appointmentId } = req?.params;
  const { status } = req?.body;

  const checkAppointment = await Appointment.findById(appointmentId);

  if (!checkAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  const statusUpdate = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true },
  );

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found,
    );
  }
  return { statusUpdate };
};

export const getAllAppointment = async (req) => {
  const allAppointment = await Appointment.find().populate("visitor");
  if (!allAppointment) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  return { allAppointment };
};

export const getAppointmentByDate = async (req) => {
  const { date } = req?.body;
  if (!date) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const appointments = await Appointment.find({ date });

  return appointments;
};

export const getAppointmentByAptID = async (req) => {
  const { appointmentId } = req?.body;
  if (!appointmentId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const appointment = await Appointment.find({ appointmentId });

  return appointment;
};

export const getAppointmentByName = async (req) => {
  const { inputName } = req?.query;
  if (!inputName) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  const appointment = await Appointment.find().populate({
    path: "visitor",
    match: { firstName: inputName },
    select: "firstName",
  });
  // const appointment = await Appointment.find().populate({ path: "visitor", match: { firstName: { $regex: new RegExp(inputName, "i") } } });

  const filteredAppointment = appointment.filter((app) => app.visitor);

  if (filteredAppointment.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found,
    );
  }
  return filteredAppointment;
};
