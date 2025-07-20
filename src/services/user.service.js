import bcrypt from "bcryptjs";
import prisma from "../../prisma/index.js";

const createUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);

  return prisma.user.create({ userData });
};

const queryUsers = async () => {
  return prisma.user.findMany();
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const updateUserById = async (id, userData) => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({ where: { id }, data: userData });
};

const deleteUserById = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.delete({ where: { id } });
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
