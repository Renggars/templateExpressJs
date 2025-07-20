import express from "express";
import { auth, authAcces } from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import userValidation from "../../validations/user.validation.js";
import userController from "../../controllers/user.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    authAcces(),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth(),
    authAcces(),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .put(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(
    auth(),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
