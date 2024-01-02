const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDetails: {
    type: String,
    required: true,
  },
  customerReview: {
    type: String,
    required: true,
  },
  productColor: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  productSpecification: {
    type: Array,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  rightSideView: {
    type: String,
    required: true,
  },
  leftSideView: {
    type: String,
    required: true,
  },
  useproductImg: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      productData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    },
  ],
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
