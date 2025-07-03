import slugify from "slugify";
import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModels.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { stat } from "fs";
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({
        message: "Incomplete product details",
      });
    }

    const cat = await Category.findOne({ slug: slugify(category) });
    if (!cat) {
      return res.status(400).send({
        message: "No such category found",
      });
    }
    let imageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imageLocalPath = req.files.image[0].path;
    }

    if (!imageLocalPath) {
      return res.status(400).send({ message: "image file is missing" });
    }

    console.log("Image", imageLocalPath);
    let uploadedimage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedimage) {
      return res.status(400).send({ message: "fail to upload the image" });
    }
    const newProduct = await Product.create({
      name,
      description,
      category: cat.name,
      price,
      image: uploadedimage.url,
      quantity,
      slug: slugify(name),
    });

    return res.status(200).send({
      success: true,
      message: "Created product",
      newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "error in creating product",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ message: "Incomplete product details" });
    }

    // 📦 Find existing product by old slug (or you could use id)
    const prod = await Product.findOne({ slug: slugify(name) });
    if (!prod) {
      return res.status(404).send({ message: "No such product found" });
    }

    // 🏷️ Resolve category
    const cat = await Category.findOne({ slug: slugify(category) });
    if (!cat) {
      return res.status(400).send({ message: "No such category found" });
    }

    // 🌄 Handle image only if user sent a new one
    let imageUrl = prod.image; // fallback to old
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      const localPath = req.files.image[0].path;
      const uploadRes = await uploadOnCloudinary(localPath);
      if (!uploadRes) {
        return res.status(500).send({ message: "Failed to upload new image" });
      }
      imageUrl = uploadRes.secure_url;
    }

    // ✏️ Build updated fields
    const updatedData = {
      name,
      description,
      price,
      quantity,
      category: cat.name,
      image: imageUrl,
      slug: slugify(name),
    };

    // 🔄 Perform update
    const newProduct = await Product.findByIdAndUpdate(prod._id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({
      success: true,
      message: "Product updated",
      newProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const prod = await Product.find({});
    return res.status(200).send({
      message: "Fetched successfully",
      prod,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Failed to fetch all products",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const prod = await Product.findOne({ slug });
    if (!prod) {
      return res.status(400).send({
        success: false,
        message: "No such product",
      });
    }
    return res.status(200).send({
        prod,
        success: true,
        message: "product fetched successfully",
      });

  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Failed to fetch the product",
    });
  }
};

export const deleteProductController = async (req, res) =>{
try {
    const id = req.params.id;
    const prod = await Product.findById({ _id : id });
    if (!prod) {
      return res.status(400).send({
        success: false,
        message: "No such product",
      });
    }
    await Product.findByIdAndDelete(prod._id)
    return res.status(200).send({
        success: true,
        message: "product deleted successfully",
      });

  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Failed to delete the product",
    });
  }
};