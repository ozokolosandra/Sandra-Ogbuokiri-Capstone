import express from "express";
import  *  as moodController from "../controllers/mood-controller.js" // Import the function correctly
import { verifyToken } from "../middleware/authMiddleware.js";

const moodRouter = express.Router();

// Set up the route to get all moods
moodRouter.route("/")
.get(verifyToken, moodController.getAllMoods)
.post(moodController.createMood);

moodRouter.route("/:id")
.get(moodController.getMoodById);



export default moodRouter;
