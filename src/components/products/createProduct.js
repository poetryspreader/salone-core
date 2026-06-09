import { Product } from "../../../app.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export async function createProduct(req, res) {
    try {
        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }


        const product = await Product.create({
            name: {
                en: req.body.name?.en,
                ru: req.body.name?.ru
            },

            description: {
                en: req.body.description?.en,
                ru: req.body.description?.ru
            },

            category: {
                en: req.body.category?.en,
                ru: req.body.category?.ru
            },

            price: Number(req.body.price),
            available: req.body.available === "true",
            image: imageUrl
        });

        res.status(201).json(product);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
            error: error
        });
    }
}