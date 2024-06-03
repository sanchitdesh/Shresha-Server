import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

// Create a new payment intent

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr"
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// Create a new coupon
export const newCoupon = TryCatch(async (req, res, next) => {
  const { code, amount } = req.body;

  if (!code || !amount) {
    return next(
      new ErrorHandler("Please enter both coupon code and amount", 400)
    );
  }
  await Coupon.create({ code, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${code} Created Successfully`
  });
});

// Apply a discount using a coupon code
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return next(new ErrorHandler("Please provide a coupon code", 400));
  }

  const discount = await Coupon.findOne({ code });

  if (!discount) {
    return next(new ErrorHandler("Invalid Coupon Code", 400));
  }

  return res.status(200).json({
    success: true,
    discount: discount.amount
  });
});

// Get all coupons
export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons
  });
});

// Delete a coupon by ID
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon ID", 400));
  }

  //   await Coupon.deleteOne();

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Deleted Successfully`
  });
});

// Get a coupon details by ID
export const getCouponById = TryCatch(async (req, res, next) => {
  //   const id = req.params.id;
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon ID", 400));
  }

  return res.status(200).json({
    success: true,
    coupon
  });
});

// Get a coupon details by Coupon Code
export const getCouponByCode = TryCatch(async (req, res, next) => {
  //   const code = req.query.code;
  const { code } = req.query;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new ErrorHandler("Invalid Coupon Code", 400));
  }

  return res.status(200).json({
    success: true,
    coupon
  });
});
