import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const requireSignin = async (req, res, next) => {
  try {
    // jwt token actually contain data about user
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// admin access
export const isAdmin = async (req, res, next) => {
  try {
    const cur_user = await User.findById(req.user._id);
    if (cur_user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({
        success : false,
        error,
        message : "error in auth midddleware",
    })
  }
};
