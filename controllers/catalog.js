const Products = require("../models/Products.model");
const User = require("../models/Users.model");
const multer = require("multer");
const path = require("path");

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      // const products = await Products.find({});
      const clothesPromises = Products.find({ category: clothing });
      const bagsPromises = Products.find({ category: bags });
      const shoesPromises = Products.find({ category: shoes });
      const accesoriesPromises = Products.find({ category: accesory });
      const promises = [
        clothesPromises,
        bagsPromises,
        shoesPromises,
        accesoriesPromises,
      ];
      const [clothes, bags, shoes, accesories] = await promise.all(promises);
      res.json({ clothes, bags, shoes, accesories });
    } catch (err) {
      res.json(err);
    }
  },
  getNewestProducts: async (req, res) => {
    try {
      const products = await Products.find({})
        .sort({ updatedAt: -1 })
        .limit(15);
      res.json(products);
    } catch (err) {
      res.json(err);
    }
  },
  getProductsFromSeller: async (req, res) => {
    try {
      const seller = req.query.seller;
      const products = await Products.find({ seller: seller });
      res.json(products);
    } catch (err) {
      res.json(err);
    }
  },
  getSingleProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Products.find({ _id: id });
      res.json(product);
    } catch (err) {
      res.json(err);
    }
  },
  getByCategory: async (req, res) => {
    const escapeRegex = (text) =>
      text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const category = escapeRegex(req.query.category);
    try {
      const products = await Products.find({ category: category });
      res.json(products);
    } catch (err) {
      res.json(err);
    }
  },
  uploadProduct: async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        color,
        gender,
        size,
        price,
        description,
      } = req.body;
      const storage = multer.diskStorage({
        destination: (req, file, done) => done(null, "products/"),
        filename: function (req, file, done) {
          done(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
          );
        },
      });
      let upload = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
      }).single("productImage");
      let url = "";
      upload(req, res, (err) => {
        if (!req.file) return res.json("please upload image of this product");
        if (err) return res.json(err);

        url = req.req.file.path;
      });
      const product = new Product({
        name: name,
        seller: req.user._id,
        category: category,
        description: description,
        updatedAt: Date.now(),
        imageUrl: url,
        price: price,
        color: color,
        size: size,
        gender: gender,
      });
      await product.save();
      req.flash("success", "product added to your store successfully");
      res.redirect("back");
    } catch (err) {
      res.json(err);
    }
  },
  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const {
      name,
      category,
      price,
      color,
      gender,
      size,
      price,
      description,
    } = req.body;
    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        {
          $set: {
            name,
            category,
            price,
            color,
            gender,
            size,
            price,
            description,
          },
        },
        { new: true, runValidators: true }
      );
      if (!product) return res.json("product not found");

      await product.save();
      req.flash("success", "product updated succesfully");
      res.redirect("back");
    } catch (err) {
      res.json(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      if (!productId) return res.json("product don't exist");
      const deleted = await Product.deleteOne({ _id: productId });
      if (!deleted) return res.json("error occured");

      req.flash("success", "product removed succesfully");
      res.redirect("back");
    } catch (err) {
      res.json(err);
    }
  },
};
