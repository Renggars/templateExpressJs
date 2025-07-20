import userService from "../services/user.service.js";

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    message: "Create User Succes",
    data: user,
  });
};

const getUsers = async (req, res) => {
  const users = await userService.queryUsers();

  res.status(200).json({
    message: "Get Users Success",
    data: users,
  });
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  res.status(200).json({
    message: "Get User Success",
    data: user,
  });
};

const updateUser = async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(200).json({
    message: "Update User Success",
    data: user,
  });
};

const deleteUser = async (req, res) => {
  await userService.deleteUserById(req.params.userId);

  res.status(200).json({
    message: "Delete User Success",
  });
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
