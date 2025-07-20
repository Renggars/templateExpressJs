import winston from "winston";

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: "info",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
