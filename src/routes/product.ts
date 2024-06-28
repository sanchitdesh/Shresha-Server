import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getLatestProducts,
  getSingleProduct,
  updateProduct,
  newProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

//=========================DEFINING ROUTES==========================

//route - /api/v1/product/create
app.post("/create", adminOnly, singleUpload, newProduct);

//route - /api/v1/product/latest
app.get("/latest", getLatestProducts);

//route - /api/v1/product/categories
app.get("/categories", getAllCategories);

//route - /api/v1/product/all
app.get("/all", getAllProducts);

//route - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);

//route - /api/v1/product/:id
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
