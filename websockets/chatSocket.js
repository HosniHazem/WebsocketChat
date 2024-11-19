const jwt = require("jsonwebtoken");
require("dotenv").config();
const { saveMessage } = require("../models/Message");

let clients = new Map(); // Map to store connected users

function setupChatSocket(wss) {
  wss.on("connection", (ws, req) => {
    // Extract and verify token from query string
    const token = req.url.split("?token=")[1];
    if (!token) {
      ws.close(1008, "Authentication token required");
      return;
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      ws.close(1008, "Invalid token");
      return;
    }

    // Add user to clients
    clients.set(user.id, ws);
    console.log(`User ${user.email} connected`);

    // Handle incoming messages
    ws.on("message", async (message) => {
      try {
        const { to, content } = JSON.parse(message);

        // Save message in the database
        await saveMessage(user.id, to, content);

        if (clients.has(to)) {
          clients.get(to).send(JSON.stringify({ from: user.id, content }));
        } else {
          ws.send(JSON.stringify({ error: "User not connected" }));
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      clients.delete(user.id);
      console.log(`User ${user.email} disconnected`);
    });
  });
}

module.exports = { setupChatSocket };
