import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    // destructure and get the required data

    const { name, email, password, phone, address ,answer} = req.body;
    // validation
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }

    // existing user validation
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "already registered please login" });
    }

    // register user
    const hashedPassword = await hashPassword(password);

    // save
    const user = await new User({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      answer
    }).save();
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log(password, email);
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "invalid password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email is not registered",
      });
    }
    
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "INVALID CREDENTIALS",
      });
    }

    // user is now verified and hence we shall now create tokens

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });
    res.status(200).send({
      success: true,
      message: "LOGIN SUCCESSFULLY",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role : user.role,
        token : token
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req,res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: "Incomplete credentials" });
    }

    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    const hashed = await hashPassword(newPassword);
    const response = await User.findByIdAndUpdate(user._id, {
      password: hashed,
    });
    if (response) {
      return res.status(200).send({
        success: true,
        message: "password changed successfully",
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "password did not changed successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  return res.status(200).send({
    message: "Test route",
  });
};
