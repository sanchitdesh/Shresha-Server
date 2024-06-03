import { Request, Response, NextFunction } from "express"; // Ensure proper imports
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Assuming ErrorHandler accepts a message and a status code
export const adminOnly = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    if (!id) {
      return next(new ErrorHandler("Logged In first", 401)); // Pass both message and status code
    }

    const user = await User.findById(id);

    // User exists or not
    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 401)); // Pass both message and status code
    }

    if (user.role !== "admin") {
      return next(new ErrorHandler("Logged in with Admin Credentials", 401)); // Pass both message and status code
    }
    next();
  }
);
