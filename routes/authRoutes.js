const express = require("express");
const {
  register,
  login,
  getUserByEmailController,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateToken, getUserByEmailController);

module.exports = router;
