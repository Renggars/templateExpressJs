import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";
import ApiError from "../utils/ApiError.js";
import userService from "./user.service.js";
import { tokenTypes } from "../config/tokens.js";
import status from "http-status";

// Manual status code
const NOT_FOUND = 404;

/**
 * Tambah waktu ke tanggal sekarang
 * @param {number} value - jumlah waktu
 * @param {'minutes' | 'days'} unit - satuan waktu
 * @returns {Date}
 */
const addTime = (value, unit) => {
  const now = new Date();
  if (unit === "minutes") {
    return new Date(now.getTime() + value * 60 * 1000);
  }
  if (unit === "days") {
    return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
  }
  throw new Error("Unsupported time unit");
};

/**
 * Generate JWT token
 */
const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Simpan token ke database
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await prisma.token.create({
    data: {
      token,
      userId,
      expires,
      type,
      blacklisted,
    },
  });
  return tokenDoc;
};

/**
 * Verifikasi token
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const tokenDoc = await prisma.token.findFirst({
    where: {
      token,
      type,
      userId: payload.sub,
      blacklisted: false,
    },
  });

  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

/**
 * Generate access & refresh tokens
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = addTime(
    parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || "30"),
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = addTime(
    parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS || "30"),
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

/**
 * Generate reset password token
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(NOT_FOUND, "No users found with this email");
  }
  const expires = addTime(
    parseInt(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || "10"),
    "minutes"
  );
  const resetToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = addTime(
    parseInt(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || "10"),
    "minutes"
  );
  const verifyToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyToken;
};

export {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
