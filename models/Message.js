const pool = require("../config/db");

async function saveMessage(from, to, content) {
  await pool.execute(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
    [from, to, content]
  );
}

async function getMessages(SenderId, ReceiverId) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?) 
         ORDER BY created_at`,
      [SenderId, ReceiverId, ReceiverId, SenderId]
    );
    return rows;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

module.exports = { saveMessage, getMessages };
