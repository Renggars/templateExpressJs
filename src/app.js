import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import status from "http-status";

import routes from "./routes/v1/index.js";
import morgan from "./config/morgan.js";
import jwtStrategy from "./config/passport.js";
import authLimiter from "./middlewares/rateLimiter.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import ApiError from "./utils/ApiError.js";

const app = express();

const ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = ENV === "production";
const IS_TEST = ENV === "test";

if (!IS_TEST) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Security HTTP headers
app.use(helmet());

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Sanitize input data
app.use(xss());

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors());
app.options("*", cors());

// JWT authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Rate limiter untuk auth endpoint (hanya production)
if (IS_PRODUCTION) {
  app.use("/v1/auth", authLimiter);
}

// Routes;
app.use("/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, "Not found"));
});

// Error converter dan handler
app.use(errorConverter);
app.use(errorHandler);

export default app;
