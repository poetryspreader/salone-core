import { Product } from "../../models/Product.js";

export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({
            "category.en": 1
        });

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get products"
        });
    }
}