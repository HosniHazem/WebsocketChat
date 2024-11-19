const { getMessages } = require("../models/Message");

async function getChatHistory(req, res) {
  const { SenderId, ReceiverId } = req.params;

  if (!SenderId || !ReceiverId) {
    return res
      .status(400)
      .json({ error: "Sender ID and Receiver ID are required" });
  }

  // Validate that SenderId and ReceiverId are integers
  if (isNaN(SenderId) || isNaN(ReceiverId)) {
    return res
      .status(400)
      .json({ error: "Sender ID and Receiver ID must be valid numbers" });
  }

  try {
    const messages = await getMessages(SenderId, ReceiverId);
    if (!messages.length) {
      return res.status(404).json({ error: "No chat history found" });
    }
    res.json({ messages });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
}

module.exports = { getChatHistory };
