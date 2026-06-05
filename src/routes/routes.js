import express from "express";
const router = express.Router();

import { getWorkers } from "../components/workers/getWorkers.js";
import { createWorker } from "../components/workers/createWorker.js";

import { createTips } from "../components/tips/createTips.js";

import { createProduct } from "../components/products/createProduct.js";

import { login } from "../components/auth/login.js";
import { checkAuth } from "../middleware/checkAuth.js";

// LOGIN
router.post("/login", login);

// WORKERS
router.get("/workers", getWorkers);
router.post("/workers", createWorker);

// TIPS
// router.get("/tips", listShifts);
router.post("/tips", createTips);

// PRODUCTS
router.post("/products", createProduct);



export default router;