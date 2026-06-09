import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

import { getWorkers } from "../components/workers/getWorkers.js";
import { createWorker } from "../components/workers/createWorker.js";

import { createTips } from "../components/tips/createTips.js";

import { getProducts } from "../components/products/getProducts.js";
import { createProduct } from "../components/products/createProduct.js";
import { deleteProduct } from "../components/products/deleteProduct.js";

import { login } from "../components/auth/login.js";
import { checkAuth } from "../middleware/checkAuth.js";


// LOGIN
router.post("/login", login);

// WORKERS
router.get("/workers", checkAuth, getWorkers);
router.post("/workers", checkAuth, createWorker);

// TIPS
// router.get("/tips", listShifts);
router.post("/tips", checkAuth, createTips);

// PRODUCTS
router.post(
    "/products",
    checkAuth,
    upload.single("image"),
    createProduct
);

router.get(
    "/products",
    checkAuth,
    getProducts
);

router.delete(
    "/products/:id",
    checkAuth,
    deleteProduct
);

export default router;