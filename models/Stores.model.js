const mongoose = require("mongoose");
const User = require("./Users.model");
const Product = require("./Products.model");

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  sales: {
    type: Number,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  isActive: {
    type: Boolean,
  },
  reviews: {
    type: Number,
    default: 0,
  },
});

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
