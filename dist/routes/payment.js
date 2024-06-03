import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { getCouponById } from "../controllers/payment.js";
import { getCouponByCode } from "../controllers/payment.js";
const app = express.Router();
// route - /api/v1/payment/create
app.post("/create", createPaymentIntent);
// route - /api/v1/payment/coupon/new
app.get("/discount", applyDiscount);
// route - /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
// route - /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);
// route - /api/v1/payment/coupon/code?code=""
app.get("/coupon/code", getCouponByCode);
// route - /api/v1/payment/coupon/:id - for delete and get
app
    .route("/coupon/:id")
    .get(adminOnly, getCouponById)
    .delete(adminOnly, deleteCoupon);
export default app;
