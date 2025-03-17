import { verifyToken } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/user-controller.js";
import express from "express";
import { getUserProfile , updateUserProfile } from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.route("/").get(userController.getAllUsers);

// Public route
userRouter.get("/me", verifyToken, getUserProfile);
userRouter.put("/me", verifyToken, updateUserProfile);

//userRouter.route("/:id").get(userController.getUserById);

export default userRouter;
