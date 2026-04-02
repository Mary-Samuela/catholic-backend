import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── @route  POST /api/orders
// ── @desc   Create a new order
// ── @access Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      total,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Verify each product exists and has enough stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      shippingCost: shippingCost || 0,
      discount: discount || 0,
      total,
    });

    // Reduce stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating order" });
  }
});

// ── @route  GET /api/orders/myorders
// ── @desc   Get logged-in user's orders
// ── @access Private
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching your orders" });
  }
});

// ── @route  GET /api/orders
// ── @desc   Get all orders (admin)
// ── @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status && status !== "all") filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      orders,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

// ── @route  GET /api/orders/:id
// ── @desc   Get a single order by ID
// ── @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "firstName lastName email",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the owner or admin can view the order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorised to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching order" });
  }
});

// ── @route  PUT /api/orders/:id/status
// ── @desc   Update order status (admin)
// ── @access Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (orderStatus === "delivered") order.deliveredAt = Date.now();
    if (paymentStatus === "paid") order.paidAt = Date.now();

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating order status" });
  }
});

export default router;
