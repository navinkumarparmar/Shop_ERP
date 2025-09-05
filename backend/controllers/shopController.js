const Shop = require("../models/shopModel");
const Product = require("../models/productModel");


module.exports.createShop = async (req, res) => {
  try {
    const shop = await Shop.create({
      ...req.body,
      owner: req.user.id, 
    });
    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: shop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user }, 
      req.body,
      { new: true }
    );
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found or not yours" });
    }
    return res.json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.getAllShopsWithProducts = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner", "name email");

    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const products = await Product.find({ shop: shop._id });
        return { ...shop.toObject(), products };
      })
    );

    return res.json({
      success: true,
      count: shopsWithProducts.length,
      data: shopsWithProducts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.getAllShopsWithProducts = async (req, res) => {
  try {
    const userId = req.user.id; 

    const shops = await Shop.find({ owner: userId });
    const shopsWithProducts = await Promise.all(
      shops.map(async (shop) => {
        const products = await Product.find({ shop: shop._id });
        return { ...shop.toObject(), products };
      })
    );

    return res.json({
      success: true,
      count: shopsWithProducts.length,
      data: shopsWithProducts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
