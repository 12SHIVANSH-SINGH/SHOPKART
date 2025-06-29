import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const requireSignin = (req, res, next) => {
  try {
    // 1. Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // 2. Extract token from "Bearer <token>" format
    const token = req.headers.authorization.split(" ")[1];
    
    // 3. Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    
    // 4. Proper error responses
    let message = "Invalid token";
    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Malformed token";
    }
    
    return res.status(401).json({
      success: false,
      message
    });
  }
};

// Admin access middleware
export const isAdmin = async (req, res, next) => {
  try {
    // 1. First ensure requireSignin has set req.user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // 2. Find user
    const cur_user = await User.findById(req.user._id);
    if (!cur_user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3. Check admin role
    if (cur_user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};