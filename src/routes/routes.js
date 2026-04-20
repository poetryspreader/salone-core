import express from "express";
const router = express.Router();

import { getWorkers } from "../components/workers/getWorkers.js";
import { createWorker } from "../components/workers/createWorker.js";

import { createTips } from "../components/tips/createTips.js";
// import listTips from "../components/tips/getWorkers.js";


// WORKERS
router.get("/workers", getWorkers);
router.post("/workers", createWorker);

// SHIFTS
// router.get("/tips", listShifts);
router.post("/tips", createTips);

// TIPS
// router.get("/tips", listTips);
// router.post("/tips", createTips);

export default router;