import mongoose from "mongoose";
export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"]
    },
    description: {
        type: String,
        required: [true, "Enter product description"]
    },
    photo: {
        type: String,
        required: [true, "Insert a photo"]
    },
    price: {
        type: Number,
        required: [true, "Enter a price"]
    },
    size: {
        type: String,
        required: [true, "Enter a size"]
    },
    stock: {
        type: Number,
        required: [true, "Enter a number of stock"]
    },
    category: {
        type: String,
        required: [true, "Enter a category"],
        trim: true
    },
    // Adding the color attribute
    color: {
        type: String,
        required: [true, "Enter a color"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
export const Product = mongoose.model("Product", productSchema);
