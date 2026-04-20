import { Worker } from "../../../app.js";

export async function createWorker(req, res) {
    try {
        const { name, surname, role, coefficientType, baseCoefficient } = req.body;

        const worker = await Worker.create({
            name,
            surname,
            role,
            coefficientType,
            baseCoefficient
        });

        res.status(201).json(worker);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create worker"
        });
    }
}