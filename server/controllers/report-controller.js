import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getReport= async (req,res)=>{
try {
  const data = await knex("reports").select(
    "id",
    "user_id",
    "report_data"

  )  
  res.status(200).json(data)
} catch (error) {
    res.status(400).send(`Error retrieving moods : ${error}`)

}
}

const createReport = async (req, res) => {
    try {
        // Extract user_id and report_data from req.body
        const { user_id, report_data } = req.body;

        // Validate required fields
        if (!user_id || !report_data) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert the new report
        const [insertedId] = await knex("reports").insert({
            user_id,
            report_data,
        });

        // Fetch the newly inserted report using the inserted ID
        const newReport = await knex("reports")
            .where("id", insertedId)
            .first();

        console.log("Inserted report:", newReport); // Debugging: log the inserted report
        res.status(201).json(newReport); // Send the new report as the response
    } catch (error) {
        console.error("Error inserting report:", error); // Debugging: log the error
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await knex("reports")
            .where("id", id)
            .first();

        if (!report) {
            return res.status(404).json({ error: "Report not found." });
        }

        res.status(200).json(report);
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}; 
export {getReport,createReport,getReportById}