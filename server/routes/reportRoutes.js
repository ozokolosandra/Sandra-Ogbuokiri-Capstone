import *   as reportController from"../controllers/report-controller.js";
import express  from "express";

const reportRouter = express.Router();

reportRouter.route("/")
.get(reportController.getReport)
.post(reportController.createReport)
;
reportRouter.route("/:id")
.get(reportController.getReportById)
export default reportRouter;