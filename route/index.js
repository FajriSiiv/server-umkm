const express = require("express");
const productController = require("../controller/product");
const userController = require("../controller/user");
const cartController = require("../controller/cart");
const { isLoggedIn } = require("../middleware/user");
const historyController = require("../controller/historyCart");

const router = express.Router();

// products
router.get("/api/product", isLoggedIn, productController.getProducts);
router.get("/api/product/:id", productController.getProductById);
router.post("/api/product", productController.postProduct);
router.patch("/api/product/:id", productController.editProduct);
router.delete("/api/product/:id", productController.deleteProduct);

// user
router.post("/api/login", userController.Login);
router.get("/api/logout", isLoggedIn, userController.Logout);
router.post("/api/register", userController.registerUser);

// cart
router.post("/api/add-to-cart", cartController.addToCart);
router.get("/api/get-cart", cartController.getCart);
router.patch("/api/update-quantity", cartController.updateQuantity);
router.delete("/api/delete-cart", cartController.deleteCart);

// history
router.get("/api/history", historyController.getHistory);
router.delete("/api/history/:id", historyController.deleteHistory);
router.post("/api/complete/:id", historyController.completeCart);

module.exports = router;
