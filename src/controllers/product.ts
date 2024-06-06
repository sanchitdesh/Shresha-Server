import { Request } from "express";
import { rm } from "fs";
import dotenv from "dotenv";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

import { invalidateCache } from "../utils/features.js";

dotenv.config({
  path: "./.env"
});

//==============================GET LATEST PRODUCTS=======================

// Revalidate on New,Update,Delete Product & on New Order
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(Number(process.env.LATEST_PRODUCT) || 5);
    myCache.set("latest-products", JSON.stringify(products));
  }
  const totalProducts = products.length;
  return res.status(200).json({
    totalProducts,
    products,
    success: true
  });
});

//==============================GET ALL PRODUCT CATEGORIES=======================

// Revalidate on New,Update,Delete Product & on New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }
  const totalCategories = categories.length;
  return res.status(200).json({
    totalCategories,
    categories,
    success: true
  });
});

//==============================GET ADMIN PRODUCTS=======================

// Revalidate on New,Update,Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }
  const totalProducts = products.length;
  return res.status(200).json({
    totalProducts,
    products,
    success: true
  });
});

//==============================GET SINGLE PRODUCT=======================

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    totalProduct: 1,
    product,
    success: true
  });
});

//==============================NEW PRODUCT=======================

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { category, name, price, stock, size, color, description } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (
      !name ||
      !price ||
      !stock ||
      !category ||
      !size ||
      !color ||
      !description
    ) {
      rm(photo.path, () => {
        console.log("Deleted");
      });

      return next(new ErrorHandler("Please enter All Fields", 400));
    }

    await Product.create({
      name,
      description,
      category: category.toLowerCase(),
      price,
      stock,
      size: size.toUpperCase(),
      color: color.toLowerCase() || color.toUpperCase(),
      photo: photo.path
    });

    //Validation
    invalidateCache({ product: true, admin: true });
    console.log(req.file);
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully"
    });
  }
);

//==============================UPDATE PRODUCTS=======================

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, size, category, color, description } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (size) product.size = size;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (color) product.color = color;

  await product.save();

  //Validation

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully"
  });
});

//==============================DELETE PRODUCTS=======================

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photo!, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  //Validation
  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully"
  });
});

//==============================GET ALL PRODUCTS=======================

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price, size, color } = req.query;

    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 15;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i"
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price)
      };

    if (category) baseQuery.category = category;

    if (color) {
      baseQuery.color = color;
    }

    if (size) {
      baseQuery.size = size;
    }

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery)
    ]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);
    const totalProducts = filteredOnlyProducts.length;

    return res.status(200).json({
      totalProducts,
      products,
      totalPage,
      success: true
    });
  }
);

//==============================TEMP ADD PRODUCTS=======================
/*
const generateRandomProducts = async (count: number = 10) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      color: faker.color.rgb(),
      photo: "uploads\\08191a3a-cc8d-48ce-ba57-64e16eddda51.png",
      price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
      stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
      category: faker.commerce.department(),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
      __v: 0
    };

    products.push(product);
  }

  await Product.create(products);

  console.log({ success: true });
};

// generateRandomProducts(50);
*/
//==============================TEMP DELETE PRODUCTS=======================
/*
const deleteRandomsProducts = async (count: number = 10) => {
  const products = await Product.find({}).skip(2);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await product.deleteOne();
  }

  console.log({ success: true });
};
// deleteRandomsProducts(38)
*/
