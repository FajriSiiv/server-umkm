const express = require("express");
const productController = require("../controller/product");
const userController = require("../controller/user");
const cartController = require("../controller/cart");
const { isLoggedIn } = require("../middleware/user");

const router = express.Router();

// products
router.get("/api/product", productController.getProducts);
router.get("/api/product/:id", productController.getProductById);
router.post("/api/product", productController.postProduct);
router.patch("/api/product/:id", productController.editProduct);
router.delete("/api/product/:id", productController.deleteProduct);

// user
router.post("/api/login", userController.Login);
router.get("/api/logout", isLoggedIn, userController.Logout);
router.post("/api/register", userController.registerUser);

// cart

router.post("/api/add-to-cart", isLoggedIn, cartController.addToCart);
router.get("/api/get-cart", isLoggedIn, cartController.getCart);
router.patch("/api/update-quantity", isLoggedIn, cartController.updateQuantity);
router.delete("/api/delete-cart", isLoggedIn, cartController.deleteCart);

module.exports = router;
