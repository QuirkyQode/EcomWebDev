import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide product name"],
        trim: true,
        maxLength: [120, "Product name should be < 120 chars"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        maxLength: [5, "Product name should be < 5 chars"],
    },
    description: { //USe markdown editor or something
        type: String, 
    },
    photos: [{
        secure_url: {
            type: String,
            required: true,
        },
    }],
    stock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    collectionId: { //REfer collection schema
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
    }
    // Can add wishlist, cart etc features
},{
    timestamps:true,
})

export default mongoose.model("Product", productSchema)