import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: {
        type:[{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            count:Number,
            price: Number,
        }],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phoneNumer: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    coupon: String,
    transactionID: String,
    status: {
        type: String,
        enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "ORDERED",
        // improve this
        // Payment mode
    }
}, {
    timestamps:true,
});

export default mongoose.model("Order", orderSchema);