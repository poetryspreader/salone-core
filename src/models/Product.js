import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        en: { type: String },
        ru: { type: String }
    },

    description: {
        en: { type: String },
        ru: { type: String }
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        en: { type: String },
        ru: { type: String }
    },

    available: {
        type: Boolean,
        default: true
    },

    image: {
        type: String
    }
});

export const Product = mongoose.model("Product", productSchema);