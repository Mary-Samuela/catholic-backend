import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["books", "articles", "av"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    badge: {
      type: String,
      enum: ["Best Seller", "Popular", "New", null],
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    details: {
      type: [String], // array of strings e.g. ["Hardcover", "300 pages"]
      default: [],
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

// ── Text index for search ──
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
