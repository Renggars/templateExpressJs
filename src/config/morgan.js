import morgan from "morgan";
import logger from "./logger.js"; // pastikan logger.js sudah ada dan benar

// Token untuk log pesan error khusus (diambil dari res.locals.errorMessage)
morgan.token("message", (req, res) => res.locals.errorMessage || "");

// Format IP hanya muncul di production
const getIpFormat = () =>
  process.env.NODE_ENV === "production" ? ":remote-addr - " : "";

// Format log untuk response sukses (< 400)
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

// Format log untuk response error (>= 400)
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Handler untuk log sukses
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

// Handler untuk log error
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => logger.error(message.trim()),
  },
});

export default {
  successHandler,
  errorHandler,
};
