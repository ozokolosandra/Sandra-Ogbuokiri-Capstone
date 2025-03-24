import express from "express";
import  *  as moodController from "../controllers/mood-controller.js" // Import the function correctly
import { verifyToken } from "../middleware/authMiddleware.js";

const moodRouter = express.Router();

moodRouter.route("/")
.get(verifyToken, moodController.getAllMoods)
.post(moodController.createMood);


export default moodRouter;
