import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getAllProductController, getSingleProductController, updateProductController } from "../controllers/ProductController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.route("/create-product").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  requireSignin,
  isAdmin,
  createProductController
);

router.route("/update-product").post(
     upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  requireSignin,
  isAdmin,
  updateProductController
);

router.route('/all-products').get(getAllProductController)
router.route('/single-product/:slug').get(getSingleProductController)
router.route('/delete-product/:id').delete(deleteProductController)


export default router;
