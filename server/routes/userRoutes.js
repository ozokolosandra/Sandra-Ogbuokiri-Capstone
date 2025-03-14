import *   as userController from"../controllers/user-controller.js";
import express  from "express";

const userRouter = express.Router();

userRouter.route("/")
.get(userController.getAllUsers)
.post(userController.createUsers);

userRouter.route("/:id")
.get(userController.getUserById)
export default userRouter;