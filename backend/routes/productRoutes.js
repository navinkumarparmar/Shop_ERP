const express = require("express");
const apiroutes = express.Router();
const {verifyToken} = require("../middlwere/tokenVerify");
const {
  createProduct,
  updateProduct,
  getProductsByShop,
  Delete,
  getAllShopsWithProducts
} = require("../controllers/productController");

apiroutes.post("/:shopid", verifyToken, createProduct);               // ✅ Create product
apiroutes.put("/:id", verifyToken, updateProduct);             // ✅ Update product
apiroutes.get("/shop/:shopId",verifyToken, getProductsByShop);      // ✅ Get products of one shop
apiroutes.delete("/:id",verifyToken,Delete ); 

module.exports = apiroutes;
