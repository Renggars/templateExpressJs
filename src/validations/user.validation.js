import { z } from "zod";
import { objectId, passwordSchema } from "./custom.validation.js";

const createUser = {
  body: z.object({
    email: z.string().email({ message: "Email is not valid" }),
    password: passwordSchema,
    name: z.string().min(1, { message: "Name is required" }),
    role: z.enum(["user", "admin"]).optional(),
  }),
};

const getUsers = {
  query: z.object({
    name: z.string().optional(),
    role: z.enum(["user", "admin"]).optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  }),
};

const getUser = {
  params: z.object({
    userId: objectId,
  }),
};

const updateUser = {
  params: z.object({
    userId: objectId,
  }),
  body: z
    .object({
      email: z.string().email({ message: "Email is not valid" }).optional(),
      password: passwordSchema.optional(),
      name: z.string().min(1, { message: "Name is required" }).optional(),
      role: z.enum(["user", "admin"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be updated",
    }),
};

const deleteUser = {
  params: z.object({
    userId: objectId,
  }),
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
