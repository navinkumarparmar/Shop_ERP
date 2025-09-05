const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    category: {
      type: String,
      trim: true,
      default: "General"
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop reference is required"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


productSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model("Product", productSchema);
