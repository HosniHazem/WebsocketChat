const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { WebSocketServer } = require("ws");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { setupChatSocket } = require("./websockets/chatSocket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/chats", chatRoutes);
setupChatSocket(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
