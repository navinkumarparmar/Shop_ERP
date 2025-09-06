const Shop = require("../models/shopModel");
const Product = require("../models/productModel");
const apiError = require('../utils/ApiError');

module.exports.createShop = async (req, res,next) => {
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
   error(next);
  }
};


module.exports.updateShop = async (req, res,next) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, 
      req.body,
      { new: true }
    );
    if (!shop) {
       return new apiError("Shop not found or not yours", 404);
    }
    return res.json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  } catch (error) {
    console.log("error",error);
    error(next)
  }
};

module.exports.deleteShop = async function(req,res,next) {
    
    try {
    const shopId = req.params.id;
    console.log("req",req.params.id)
    const deletedShop = await Shop.findByIdAndDelete(shopId);
  
    if (!deletedShop) {
      return next(new apiError("Product not found", 404));
    }

    return res.json({
      success: true,
      message: "shop deleted successfully",
    });
  } catch (error) {
    next(error);
  }
  
}

module.exports.getAllShopsWithProducts = async (req, res,next) => {
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
   error(next);
  }
};


module.exports.getAllShopsWithProducts = async (req, res,next) => {
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
    error(next)
  }
};
