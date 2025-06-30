import slugify from "slugify";
import { Category } from "../models/categoryModel.js";

export const categoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).send({
        message: "Category already exists",
      });
    }

    const category = await new Category({ name, slug: slugify(name) }).save();

    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in category controller",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const cat = await Category.find({});
    return res.status(200).send({
      success: true,
      category: cat,
      message: "Fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in fetching category",
    });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const cat = await Category.find({ slug: req.params.slug });
    return res.status(200).send({
      success: true,
      category: cat,
      message: "Fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Failed to fecth category",
    });
  }
};

export const deleteCategoryController = async (req, res) =>{
  try {
    await Category.findByIdAndDelete(req.params.id);
     return res.status(200).send({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message : "Failed to delete item"
    })
  }
}