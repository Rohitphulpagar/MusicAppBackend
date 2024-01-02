const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const VerifyAuth = require("../Middleware/verifyAuth");
router.get("/products", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      productName,
      productType,
      productColor,
      productPriceMin,
      productPriceMax,
      sort,
    } = req.query;

    const filters = {};

    if (productName) {
      filters.productName = { $regex: new RegExp(productName, "i") };
    }

    if (productType) {
      filters.productType = { $regex: new RegExp(productType, "i") };
    }

    if (productColor) {
      filters.productColor = { $regex: new RegExp(productColor, "i") };
    }

    if (productPriceMin !== undefined || productPriceMax !== undefined) {
      filters.productPrice = {};

      if (productPriceMin !== undefined) {
        const minPrice = parseInt(productPriceMin, 10);
        if (!isNaN(minPrice)) {
          filters.productPrice.$gte = minPrice;
        }
      }

      if (productPriceMax !== undefined) {
        const maxPrice = parseInt(productPriceMax, 10);
        if (!isNaN(maxPrice)) {
          filters.productPrice.$lte = maxPrice;
        }
      }
      if (Object.keys(filters.productPrice).length === 0) {
        delete filters.productPrice;
      }
    }

    const options = {};

    if (sort === "priceLowToHigh") {
      options.productPrice = 1;
    } else if (sort === "priceHighToLow") {
      options.productPrice = -1;
    } else if (sort === "AtoZ") {
      options.productName = 1;
    } else if (sort === "ZtoA") {
      options.productName = -1;
    } else {
      options.productPrice = 1;
    }

    const products = await Products.find(filters).sort(options);

    res.status(200).json({
      status: "success",
      message: "Products filtered and sorted successfully.",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productDetails = await Products.findById(productId);
    res.json({
      status: "successful",
      data: productDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/cart/add", VerifyAuth.checkToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    const product = await Products.findById(productId);
    const newCartEntry = product.cart.find(
      (item) => item && item.userId && item.userId.equals(userId)
    );
    if (newCartEntry) {
      newCartEntry.quantity += quantity;
    } else {
      product.cart.push({ userId, quantity, productData: productId });
    }
    await product.save();
    res.json({ message: "Item added to cart successfully", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/cart/removeAll", VerifyAuth.checkToken, async (req, res) => {
  try {
    const userId = req.userId;
    const products = await Products.find({ "cart.userId": userId });
    for (const product of products) {
      product.cart = [];
      await product.save();
    }
    res.json({
      message: "All items removed from cart successufully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/cart", VerifyAuth.checkToken, async (req, res) => {
  try {
    const userId = req.userId;
    const products = await Products.find({ "cart.userId": userId });

    const cartItems = products.map((product) => ({
      productId: product._id,
      productName: product.productName,
      productDetails: product.productDetails,
      customerReview: product.customerReview,
      productColor: product.productColor,
      productType: product.productType,
      productSpecification: product.productSpecification || [],
      productPrice: product.productPrice,
      companyName: product.companyName,
      isAvailable: product.isAvailable,
      productImage: product.productImage,
      rightSideView: product.rightSideView,
      leftSideView: product.leftSideView,
      useproductImg: product.useproductImg,
      quantity:
        product.cart.find((item) => item.userId && item.userId.equals(userId))
          ?.quantity || 0,
    }));

    res.json({ data: cartItems });
  } catch (error) {
    console.error("Error in /user/cart route:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
