const mongoose = require("mongoose");
const Cart = require("./Carts.model");
const User = require("./Users.model");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  OrderedAt: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  amount: {
    type: Schema.Types.Decimal128,
    ref: "Cart",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
  shipping: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  shortNote: {
    type: String,
    required: true,
    default: "call on arrival",
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
