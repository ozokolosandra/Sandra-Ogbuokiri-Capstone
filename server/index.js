import express from "express";
import cors from "cors"; 

const app = express();
const PORT = process.env.PORT || 8080; 
app.use(cors()); 



app.get("/", (req, res) => {
    res.send("Hello");
});



app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});
