import httpStatus from "http-status";
import logger from "../config/logger.js";
import ApiError from "../utils/ApiError.js";
import { Prisma } from "@prisma/client";

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Jika error dari axios atau HTTP request eksternal
    if (error.response) {
      const message = error.response.data.message || error.response.data;
      const statusCode = error.response.status;

      logger.info("handleAxiosError");
      error = new ApiError(statusCode, message, false, err.stack);
    }
    // Jika error dari Prisma
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      logger.info("handlePrismaError");
      error = handlePrismaError(err);
    }
    // Error umum lainnya
    else {
      const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }

  next(error);
};

const handlePrismaError = (err) => {
  switch (err.code) {
    case "P2002":
      return new ApiError(
        400,
        `Duplicate field value: ${err.meta?.target?.join(", ")}`,
        false,
        err.stack
      );
    case "P2014":
      return new ApiError(
        400,
        `Invalid ID: ${err.meta?.target}`,
        false,
        err.stack
      );
    case "P2003":
      return new ApiError(
        400,
        `Invalid input data: ${err.meta?.target}`,
        false,
        err.stack
      );
    default:
      return new ApiError(
        500,
        `Something went wrong: ${err.message}`,
        false,
        err.stack
      );
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isProduction && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(isDevelopment && { stack: err.stack }),
  };

  if (isDevelopment) {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
