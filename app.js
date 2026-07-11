import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes)

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        console.log("Connecting to Mongo...");

        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (err) {
        console.error("Startup error ❌", err);
    }
}

start();

app.get("/test", (req, res) => {
    res.json({ ok: true });
});

app.get("/debug", (req, res) => {
    res.json({
        mongo: process.env.MONGO_URL ? "ok" : "missing"
    });
});