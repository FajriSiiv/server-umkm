const Cart = require("../model/cart");
const History = require("../model/historyCart");
const User = require("../model/user");

exports.completeCart = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const cart = await Cart.findById(id).populate("items.product");

    const historyData = {
      user: cart.user,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
      })),
      totalAmount: cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    };

    const history = new History(historyData);
    await history.save();

    await Cart.findByIdAndDelete(id);

    res.send(history);
  } catch (error) {
    throw new Error("Gagal menyelesaikan cart.");
  }
};

exports.getHistory = async (req, res) => {
  const username = req.session.username;
  const userId = await User.findOne({ username: username });

  try {
    const histories = await History.find({ user: userId }).populate(
      "items.product"
    );
    res.json(histories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal mendapatkan riwayat transaksi pengguna." });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const historyId = req.params.historyId;
    const deletedHistory = await History.findOneAndDelete(historyId);
    res.json(deletedHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
