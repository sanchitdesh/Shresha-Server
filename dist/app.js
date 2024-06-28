import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import cors from "cors";
//============================IMPORTING ROUTES=====================
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/product.js";
import dashboardRoute from "./routes/statistics.js";
import userRoute from "./routes/user.js";
import contactRoute from "./routes/contact.js";
import Stripe from "stripe";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
dotenv.config({
    path: "./.env"
});
const port = process.env.PORT || 5000;
const stripeKey = process.env.STRIPE_KEY || "";
// const mongoURI = process.env.MONGODB_URI || "";
// connectDB(mongoURI);
connectDB();
export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();
const app = express();
//===========================START MIDDLEWARE=============================
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//api routes
app.get("/", (req, res) => {
    res.send("API working on /api/v1/user");
});
//====================================ROUTES===============================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/contact", contactRoute);
//==========================ACCESS TO IMAGES PATH=========================
app.use("/uploads", express.static("uploads"));
//=============================END MIDDLEWARE=============================
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
export default app;
