import express from "express";
import  *  as moodController from "../controllers/mood-controller.js" // Import the function correctly

const moodRouter = express.Router();

// Set up the route to get all moods
moodRouter.route("/")
.get(moodController.getAllMoods)
.post(moodController.createMood);

moodRouter.route("/:id")
.get(moodController.getMoodById);



export default moodRouter;
