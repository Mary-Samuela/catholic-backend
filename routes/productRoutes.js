import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── @route  GET /api/products
// ── @desc   Get all products with search, filter, sort, pagination
// ── @access Public
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = { status: "active" };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // newest first by default
    if (sort === "price-asc") sortObj = { price: 1 };
    if (sort === "price-desc") sortObj = { price: -1 };
    if (sort === "name-asc") sortObj = { name: 1 };
    if (sort === "rating") sortObj = { rating: -1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// ── @route  GET /api/products/featured
// ── @desc   Get featured/popular products for home page
// ── @access Public
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      badge: { $in: ["Best Seller", "Popular", "New"] },
    })
      .sort({ rating: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching featured products" });
  }
});

// ── @route  GET /api/products/:id
// ── @desc   Get a single product by ID
// ── @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get related products (same category, exclude current)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    }).limit(4);

    res.json({ product, related });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product" });
  }
});

// ── @route  POST /api/products
// ── @desc   Create a new product
// ── @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, stock, badge, details } =
      req.body;

    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      badge: badge || null,
      details: details || [],
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating product" });
  }
});

// ── @route  PUT /api/products/:id
// ── @desc   Update a product
// ── @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating product" });
  }
});

// ── @route  DELETE /api/products/:id
// ── @desc   Delete a product
// ── @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product" });
  }
});

export default router;
