import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
//=================================CREATE USER===============================
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            message: `Welcome, ${user.name}`,
            success: true
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return next(new ErrorHandler("All fields are mandatory.", 400));
    }
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob)
    });
    return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`
    });
});
//=================================GET ALL USERS===============================
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(201).json({
        users: users,
        success: true
    });
});
//=================================GET A USER===============================
/*
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    //If user doesn't exist
    if (!user) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false
      });
    }

    //If user exist
    return res.status(200).json({
      message: user,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
      success: false
    });
  }
};
*/
//=========================BackUp Dynamic code for (getUser)===================
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        user
    });
});
//=================================DELETE USER===============================
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    //If user doesn't exist
    if (!user) {
        return next(new ErrorHandler("Invalid ID", 400));
    }
    await User.deleteOne();
    //If user exist
    return res.status(200).json({
        message: "User Deleted Successfully.",
        success: true
    });
});
//=================================DELETE USER===============================
