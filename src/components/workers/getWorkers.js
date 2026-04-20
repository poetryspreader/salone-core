import { Worker } from "../../../app.js";

export async function getWorkers(req, res) {
    try {
        const workers = await Worker.find().sort({ name: 1 });

        res.status(200).json(workers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get workers"
        });
    }
}