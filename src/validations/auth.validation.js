import { email, z } from "zod";
import { passwordSchema } from "./custom.validation.js";

const register = {
  body: z.object({
    email: z.string().email({ message: "Email is not valid" }),
    password: passwordSchema,
    name: z.string().min(1, { message: "Name is required" }),
  }),
};

const login = {
  body: z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  }),
};

const logout = {
  body: z.object({
    refreshToken: z.string().min(1, { message: "Refresh token is required" }),
  }),
};

const refreshToken = {
  body: z.object({
    refreshToken: z.string().min(1, { message: "Refresh token is required" }),
  }),
};

const forgotPassword = {
  body: z.object({
    email: z.string().email({ message: "Email is not valid" }),
  }),
};

const resetPassword = {
  query: z.object({
    token: z.string().min(1, { message: "Token is required" }),
  }),
  body: z.object({
    password: passwordSchema,
  }),
};

const verifyEmail = {
  query: z.object({
    token: z.string().min(1, { message: "Token is required" }),
  }),
};

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
