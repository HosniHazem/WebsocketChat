const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors"); // Import cors
const { WebSocketServer } = require("ws");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { setupChatSocket } = require("./websockets/chatSocket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);

app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/chats", chatRoutes);
setupChatSocket(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
