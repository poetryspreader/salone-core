import { Product } from "../../../app.js";
export async function createProduct(req, res) {
    try {
        const {
            name,
            description,
            price,
            category,
            available
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            available
        });

        res.status(201).json(product);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product"
        });
    }
}