const { findById } = require("../model/product");
const Product = require("../model/product");

exports.getProducts = async (req, res) => {
  const products = await Product.find()
    .then((product) => res.send(product))
    .catch((err) => console.log(err.message));

  return products;
};

exports.getProductById = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id)
    .then((prod) => res.send(prod))
    .catch((err) => console.log(err.message));

  return product;
};

exports.postProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });

    const productSave = await newProduct.save();

    res.status(201).json(productSave);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const product = await Product.findById(id);

    res.status(200).json({
      message: "Produk telah di update",
      product,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Produk tidak ada" });
    }

    res.status(200).json({
      message: "Produk telah di hapus",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
