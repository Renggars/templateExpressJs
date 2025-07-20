import express from "express";
import { auth } from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import authValidation from "../../validations/auth.validation.js";
import authController from "../../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

router.post("/login", validate(authValidation.login), authController.login);

router.post(
  "/refresh-tokens",
  validate(authValidation.refreshToken),
  authController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);

router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

export default router;
