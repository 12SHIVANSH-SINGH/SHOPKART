import { User } from "../models/userModel.js";
import { Product } from "../models/productModels.js";
import { Order } from "../models/orderModel.js";

// Add or increment item in user's cart
export const addItemController = async (req, res) => {
  try {
    const { user_id, slug } = req.params;
    if (!user_id || !slug) {
      return res.status(400).send({ message: "Incomplete data to add item to cart" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Invalid user credentials while adding item to cart" });
    }

    const item = await Product.findOne({ slug });
    if (!item) {
      return res.status(400).send({ message: "Invalid item credentials while adding item to cart" });
    }

    const cur_order = await Order.findOne({ user: user._id, item: item.name });
    if (!cur_order) {
      const newOrder = await Order.create({
        user: user._id,
        item: item.name,
        status: "Pending",
        quantity: 1,
      });
      return res.status(201).send({ success: true, message: "Successfully added to cart", order: newOrder });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      cur_order._id,
      { quantity: cur_order.quantity + 1 },
      { new: true, runValidators: true }
    );
    return res.status(200).send({ success: true, message: "Successfully increased quantity", order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to add the item to cart" });
  }
};

// Remove item entirely from user's cart
export const deleteItemController = async (req, res) => {
  try {
    const { user_id, slug } = req.params;
    if (!user_id || !slug) {
      return res.status(400).send({ message: "Incomplete data to delete item from cart" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Invalid user credentials while deleting item from cart" });
    }

    const item = await Product.findOne({ slug });
    if (!item) {
      return res.status(400).send({ message: "Invalid item credentials while deleting item from cart" });
    }

    const cur_order = await Order.findOne({ user: user._id, item: item.name });
    if (!cur_order) {
      return res.status(404).send({ message: "No such item in cart" });
    }

    await Order.deleteOne({ _id: cur_order._id });
    return res.status(200).send({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to delete item from cart" });
  }
};

// Update quantity of a specific item in cart
export const updateItemController = async (req, res) => {
  try {
    const { user_id, slug } = req.params;
    const { quantity } = req.body;
    if (!user_id || !slug || quantity == null) {
      return res.status(400).send({ message: "Incomplete data to update item in cart" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Invalid user credentials while updating cart" });
    }

    const item = await Product.findOne({ slug });
    if (!item) {
      return res.status(400).send({ message: "Invalid item credentials while updating cart" });
    }

    const cur_order = await Order.findOne({ user: user._id, item: item.name });
    if (!cur_order) {
      return res.status(404).send({ message: "No such item in cart" });
    }

    // If new quantity is zero or less, delete the item
    if (quantity < 1) {
      await Order.deleteOne({ _id: cur_order._id });
      return res.status(200).send({ success: true, message: "Quantity fell below 1, item removed from cart" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      cur_order._id,
      { quantity },
      { new: true, runValidators: true }
    );
    return res.status(200).send({ success: true, message: "Cart updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to update cart item" });
  }
};

// Get all orders (admin)
export const getAllOrderController = async (_req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    return res.status(200).send({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to fetch orders" });
  }
};

// Get all orders for a specific user
export const getUserOrderController = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Invalid user credentials" });
    }

    const orders = await Order.find({ user: user._id });
    return res.status(200).send({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Failed to fetch user orders" });
  }
};
