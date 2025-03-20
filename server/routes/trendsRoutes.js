import express from "express";
import  *  as trendController from "../controllers/trends-controller.js" 

const trendRouter = express.Router();

trendRouter.route("/")
.get(trendController.getMoodTrends);

export default trendRouter;