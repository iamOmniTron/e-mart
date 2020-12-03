const mongoose = require("mongoose");
const User = require("./Users.model");
const Product = require("./Products.model");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: String,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  modifiedOn: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  totalItems: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Schema.Types.Decimal128,
  },
});
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
