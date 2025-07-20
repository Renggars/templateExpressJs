import userService from "./user.service.js";
import bcrypt from "bcryptjs";

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  const validPassword = await bcrypt.compare(password, user.password);

  if (!user || !validPassword) {
    throw new Error("Invalid email or password");
  }
  return user;
};

export default {
  login,
};
