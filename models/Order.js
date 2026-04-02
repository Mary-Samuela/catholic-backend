import mongoose from "mongoose";

// ── Each item inside an order ──
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String, required: true },
});

// ── Delivery address ──
const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String, required: true },
  notes: { type: String, default: "" },
});

// ── Main order ──
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],

    deliveryAddress: addressSchema,

    paymentMethod: {
      type: String,
      enum: ["mpesa", "card", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    orderNumber: {
      type: String,
      unique: true,
    },

    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

// ── Auto-generate order number before saving ──
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "COS-" +
      Date.now().toString().slice(-6) +
      Math.floor(Math.random() * 100);
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
