const Product = require("../models/productModel");
const Shop = require("../models/shopModel");
const apiError = require('../utils/ApiError');

module.exports.createProduct = async (req, res,next) => {
  try {
    const {name, price, description, stock, category } = req.body;
     let ShopId = req.params.shopid;
  
    const shopData = await Shop.findOne({ _id: ShopId, owner: req.user.id });
    console.log("shopdata",shopData);
    if (!shopData) {
      return next(new apiError("Not your shop or shop not found", 403));
    }

    const product = await Product.create({
     shop: ShopId,
      name,
      price,
      description,
      stock,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
     next(error);
  }
};

module.exports.updateProduct = async (req, res,next) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop");
    if (!product) {
      return next(new apiError("Product not found", 404));
    }


    if (product.shop.owner.toString() !== req.user.id) {
       return next(new apiError("Not your shop's product", 403));
    }

    Object.assign(product, req.body);
    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


module.exports.getProductsByShop = async (req, res,next) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });
    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
   next(error);
  }
};

module.exports.Delete = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("req",req.params.id)
    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log("deletedproduct",deletedProduct);

    if (!deletedProduct) {
      return next(new apiError("Product not found", 404));
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

