import express from "express";
import cors from "cors"; 
import authRoutes from "./routes/authRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import moodRouter from "./routes/moodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trendRoutes from "./routes/trendsRoutes.js";


const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors()); 
app.use(express.json()); 
app.use("/moods", moodRouter); 
app.use("/reports", reportRoutes);
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/trends",trendRoutes)



app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});
