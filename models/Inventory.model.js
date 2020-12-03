const mongoose = require("mongoose");
const Store = require("./Stores.model");
const Product = require("./Products.model");

const Schema = mongoose.Schema;
const Inventory = new Schema({
  productsStock: {
    quantity: Number,
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  stores: {
    quantity: Number,
    storesList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
  },
});

const Inventory = mongoose.model("Inventory", Inventory);
module.exports = Inventory;
