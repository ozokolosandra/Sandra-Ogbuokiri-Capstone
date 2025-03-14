import express from "express";
import cors from "cors"; 
import reportRoutes from "./routes/reportRoutes.js"
import moodRouter from "./routes/moodRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors()); 
app.use(express.json()); // <---- Add this to parse JSON request bodies
app.use("/moods", moodRouter); 
app.use("/reports", reportRoutes);
app.use("/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});
