import *   as reportController from"../controllers/report-controller.js";
import express  from "express";

const reportRouter = express.Router();

reportRouter.route("/")
.get(reportController.getReport)

;
reportRouter.route("/:id")
.get(reportController.getReportById)
export default reportRouter;