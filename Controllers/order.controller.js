import Product from "../models/product.schema";
import Coupon from "../models/coupon.schema";
import Order from "../models/order.schema"
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";
import razorpay from "../config/razorpay.config";

export const generateRazorPayOrderId = asyncHandler(async(req, res) => {
    // get product and coupon from frontend
    
})