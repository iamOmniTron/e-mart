const express = require("express");
const router = express.Router();

//route to get all products
router.get("/", (req, res) => {
  res.json({ message: "you hit the home page" });
});
module.exports = router;
