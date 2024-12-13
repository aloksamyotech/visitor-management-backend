import winston from "winston";
import { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const customLogFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.printf((info) => {
    return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} ${
      info.stack ? `\n${info.stack}` : ""
    }`;
  }),
);

const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const logger = winston.createLogger({
  level: logLevel,
  format: customLogFormat,
  defaultMeta: { service: "your-service-name" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        format.simple(),
      ),
    }),

    new DailyRotateFile({
      filename: "logs/%DATE%-application.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true,
    }),

    new DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
});

logger.requestContext = (req, res, next) => {
  logger.defaultMeta = {
    ...logger.defaultMeta,
    requestId: req.headers["x-request-id"] || req.id,
    user: req.user || "anonymous",
  };
  next();
};

export default logger;
