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

apiroutes.post("/:shopid", verifyToken, createProduct);               
apiroutes.put("/:id", verifyToken, updateProduct);             
apiroutes.get("/shop/:shopId",verifyToken, getProductsByShop);      
apiroutes.delete("/:id",verifyToken,Delete ); 

module.exports = apiroutes;
