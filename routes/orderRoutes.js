import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  addItemController,
  deleteItemController,
  updateItemController,
  getAllOrderController,
  getUserOrderController,
} from "../controllers/OrderController.js";

const router = express.Router();

router.route("/add-item/:slug/:user_id").post(requireSignin, addItemController);

router
  .route("/delete-item/:slug/:user_id")
  .delete(requireSignin, deleteItemController);

router
  .route("/update-item/:slug/:user_id")
  .put(requireSignin, updateItemController);

router
  .route("/get-all-item")
  .get(requireSignin, isAdmin, getAllOrderController);

router
  .route("/user-orders/:user_id")
  .get(requireSignin, getUserOrderController);

export default router;
