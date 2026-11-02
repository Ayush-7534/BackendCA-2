import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());


app.use("/api/feedback", feedbackRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});


app.listen(3000, () => {
    console.log("Server Started on port 3000");
});



