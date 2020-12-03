//view user details with transactions
const User = require("../models/Users.model");
const smartJoin = (arr, seperator) => {
  if (!seperator) seperator = " ";
  return arr
    .filter((elt) => {
      return elt !== undefined && elt !== null && elt.toString().trim() !== "";
    })
    .join(seperator);
};

module.exports = async (userId) => {
  const user = await User.findById({ userId });
  if (!user) return { error: "user not found" };
  const orders = user.getOrders().map((order) => {
    return {
      orderId: order.trasactionId,
      status: order.status,
      date: order.orderedAt,
      url: `/orders/${order.transactionId}`,
    };
  });

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    fullname: smartJoin([user.firstName, user.lastName]),
    email: user.email,
    address1: user.address1,
    address2: user.address2,
    city: user.city,
    state: user.state,
    postal: user.postal,
    fullAdress: smartJoin(
      [
        user.address1,
        user.address2,
        user.city + ", " + user.state + " " + user.postal,
      ],
      "<br>"
    ),
    phone: user.phoneNumber,
    orders: user.getOrders().map((order) => {
      return {
        orderId: order.trasactionId,
        status: order.status,
        date: order.orderedAt,
        url: `/orders/${order.transactionId}`,
      };
    }),
  };
};
