import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";

const register = async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await userService.createUser(req.body);
  const tokens = await userService.generateAuthTokens(user);

  res.status(201).json({
    user,
    tokens,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);

  const tokens = await userService.generateAuthTokens(user);

  res.status(200).json({
    user,
    tokens,
  });
};

const refreshTokens = async (req, res) => {
  const tokens = await userService.refreshAuth(req.body.refreshToken);
  res.status(200).json(tokens);
};

const forgotPassword = async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );

  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  res.status(200).json({
    message: "Password reset email sent successfully",
  });
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);

  res.status(200).json({
    message: "Password reset successfully",
  });
};

const sendVerificationEmail = async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );

  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);

  res.status(200).json({
    message: "Verification email sent successfully",
  });
};

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.query.token);

  res.status(200).json({
    message: "Email verified successfully",
  });
};

export default {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
