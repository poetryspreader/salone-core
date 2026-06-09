import { Product } from "../../../app.js";

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
}