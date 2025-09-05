const Product = require("../models/productModel");
const Shop = require("../models/shopModel");


module.exports.createProduct = async (req, res) => {
  try {
    const {name, price, description, stock, category } = req.body;
     let ShopId = req.params.shopid;
  
    const shopData = await Shop.findOne({ _id: ShopId, owner: req.user.id });
    console.log("shopdata",shopData);
    if (!shopData) {
      return res
        .status(403)
        .json({ success: false, message: "Not your shop or shop not found" });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }


    if (product.shop.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not your shop's product" });
    }

    Object.assign(product, req.body);
    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports.getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });
    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.Delete = async function(req,res,next) {
  try {
      const productId = req.params.id
      const deleteproduct = await Product.findByIdAndDelete(productId);
       return res.json({
      success: true,
      message: "succesfully delete product"
    });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    
  }
  
}

