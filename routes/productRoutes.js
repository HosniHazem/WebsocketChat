const express = require("express");
const { create, getAll } = require("../controllers/productController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, create);
router.get("/", authenticateToken, getAll);

module.exports = router;
