const express = require("express");
const { getChatHistory } = require("../controllers/chatController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Fetch chat history between authenticated user and another user
router.get("/:SenderId/:ReceiverId", authenticateToken, getChatHistory);

module.exports = router;
