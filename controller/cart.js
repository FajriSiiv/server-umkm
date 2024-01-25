const Cart = require("../model/cart");
const Product = require("../model/product");
const User = require("../model/user");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const username = req.session.username;

    const userId = await User.findOne({ username: username });

    // Validasi bahwa produk dengan productId ada
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    // Cari keranjang pengguna
    let cart = await Cart.findOne({ user: userId });

    // Jika keranjang belum ada, buat baru
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Cek apakah produk sudah ada dalam keranjang
    const existingItem = cart.items.find((item) =>
      item.product.equals(productId)
    );

    // Jika produk sudah ada, update jumlahnya
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Jika produk belum ada, tambahkan ke dalam keranjang
      cart.items.push({ product: productId, quantity });
    }

    // Simpan atau update keranjang
    await cart.save();

    res.status(200).json({
      message: "Produk berhasil ditambahkan ke dalam keranjang",
      cart,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCart = async (req, res) => {
  const username = req.session.username;

  const userId = await User.findOne({ username: username });

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price"
    );

    if (!cart) {
      return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const username = req.session.username;
    const userId = await User.findOne({ username: username });

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    const existingItem = cart.items.find((item) =>
      item.product.equals(productId)
    );

    if (!existingItem) {
      return res
        .status(404)
        .json({ message: "Produk tidak ditemukan dalam keranjang" });
    }

    existingItem.quantity = quantity;

    await cart.save();

    res
      .status(200)
      .json({ message: "Jumlah produk berhasil diperbarui", cart });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const username = req.session.username;
    const userId = await User.findOne({ username: username });

    const deletedCart = await Cart.findOneAndDelete({ user: userId });

    if (!deletedCart) {
      return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    res
      .status(200)
      .json({ message: "Keranjang berhasil dihapus", deletedCart });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
