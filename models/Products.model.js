const mongoose = require("mongoose");
const User = require("./Users.model");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["bag", "shoe", "clothing", "accesory"],
    required: true,
  },
  description: {
    type: String,
    min: [2, `description too short`],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    defualt: 0.0,
    required: true,
  },
  color: {
    type: String,
  },
  size: {
    type: Schema.Types.Mixed,
  },
  gender: {
    type: String,
    enum: ["male", "female", "unisex"],
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
