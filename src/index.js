import app from "./app.js";
import prisma from "../prisma/index.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 3000;

let server;

if (prisma) {
  logger.info("Connected to Database");
  server = app.listen(PORT, () => {
    logger.info(`Listening to port http://localhost:${PORT}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error("Unexpected Error:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
