const mongoose = require("mongoose");
const Order = require("./Orders.model");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: {
    type: [String, `first name must be a string`],
    min: [3, `name must be longer than 3`],
    max: 35,
    required: true,
  },
  lastName: {
    type: [String, `first name must be a string`],
    min: [3, `name must be longer than 3`],
    max: 35,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  email: {
    type: [String, `must be a valid e-mail`],
    min: 15,
    required: true,
    unique: true,
    required: true,
  },
  emailToken: {
    type: String,
  },
  emailTokenValidity: {
    type: Number,
  },
  phoneNumber: {
    type: [Number, `phoneNumber must be a number`],
    unique: true,
  },
  googleId: {
    type: Number,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isMerchant: {
    type: Boolean,
    default: false,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  postal: {
    type: Number,
    min: 6,
    max: 6,
  },
});

UserSchema.methods.getOders = async () => {
  const orders = await Order.find({ client: this._id });
  return orders;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
