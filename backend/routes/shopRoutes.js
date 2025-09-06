const express = require("express");
const apiroutes = express.Router();
const {verifyToken} = require("../middlwere/tokenVerify");
const {
  createShop,
  updateShop,
  getAllShopsWithProducts,
  deleteShop,
} = require("../controllers/shopController");

apiroutes.post("/", verifyToken, createShop);         
apiroutes.put("/:id", verifyToken, updateShop);       
apiroutes.get("/all", verifyToken,getAllShopsWithProducts); 
apiroutes.get('/myshops',verifyToken,getAllShopsWithProducts)
apiroutes.delete('/:id',verifyToken,deleteShop)
module.exports = apiroutes;
