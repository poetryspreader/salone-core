import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/routes.js";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


// WORKER MODEL
const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    role: {
        type: String,
        enum: [
            "manager",
            "bar manager",
            "barback",
            "bartender",
            "half-bartender",
            "waiter",
            "half-waiter",
            "somelier",
            "runner",
            "hostess",
            "helper"
        ]
    },
    coefficientType: {
        type: String,
        enum: ["fixed", "manual"],
        default: "manual"
    },
    baseCoefficient: {
        type: Number,
        default: 0.5
    }
});
export const Worker = mongoose.model("Worker", workerSchema);

// SHIFT MODEL
const shiftSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    isWeekend: {
        type: Boolean,
        default: false
    },
    periods: [
        {
            _id: false,
            from: {
                type: Number
            },
            till: {
                type: Number,
            },
            tipsAmount: {
                type: Number,
                required: true
            },
            cleanTips: {
                type: Number,
                required: true
            },
            halfWaiterCoef: {
                type: Number
            },
            somelierCoef: {
                type: Number
            },
            halfBartenderCoef: {
                type: Number
            },
            earlyWorkerLateShiftImpact: {
                type: Number
            },
            workerManualRates: [
                {
                    workerId: {
                        type: String
                    },
                    value: {
                        type: Number
                    }
                }
            ]
        }
    ],
    schedule: [
        {
            _id: false,
            worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
            shiftStart: {
                type: Number,
                required: true
            },
            shiftEnd: {
                type: Number
            },
            tillEnd: { type: Boolean, default: true},
            coefficient: { type: Number }
        }
    ],
    tipsTotal: {
        type: Number
    },
    tipsKitchen: {
        type: Number,
        default: 0
    },
    transportFund: {
        type: Number,
        default: 0
    },
    distribution: [
        {
            _id: false,
            worker: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Worker"
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    ]
});
export const Shift = mongoose.model("Shift", shiftSchema);

app.use(cors());
app.use(express.json());
app.use('/api', routes)

app.get("/test", (req, res) => {
    res.json({ ok: true });
});

app.get("/debug", (req, res) => {
    res.json({
        mongo: process.env.MONGO_URL ? "ok" : "missing"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));