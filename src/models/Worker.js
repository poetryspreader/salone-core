import mongoose from "mongoose";

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