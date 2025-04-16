// chat-server/index.js
const http = require("http");
const WebSocket = require("ws");
const axios = require("axios");

const LARAVEL_BASE_URL = process.env.LARAVEL_API_URL || "http://laravel:8000";
const LARAVEL_API_TOKEN = process.env.LARAVEL_API_TOKEN || "SOME_SERVICE_TOKEN";

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", async (socket) => {
  console.log("New client connected");

  //Fetch the latest messages from Laravel and send as "history"
  try {
    const res = await axios.get(`${LARAVEL_BASE_URL}/api/v1/chat/messages`, {
      headers: {
        Authorization: `Bearer ${LARAVEL_API_TOKEN}`,
      },
    });
    const history = res.data; // [ { id, user_id, content, created_at, ... }, ... ]

    // Send to the newly connected socket
    socket.send(JSON.stringify({ type: "history", payload: history }));
  } catch (err) {
    console.error("Error loading history from Laravel:", err.response?.data || err.message);
    // Send empty array if error
    socket.send(JSON.stringify({ type: "history", payload: [] }));
  }

  //Listen for messages from clients
  socket.on("message", async (rawMsg) => {
    try {
      const data = JSON.parse(rawMsg); // e.g. { content: "Hello", user: "Alice" }
      if (!data.content || typeof data.content !== "string") {
        return; // skip invalid
      }

      //Send to Laravel to create message
      const res = await axios.post(
        `${LARAVEL_BASE_URL}/api/v1/chat/messages`,
        { content: data.content },
        { headers: { Authorization: `Bearer ${LARAVEL_API_TOKEN}` } }
      );

      const savedMessage = res.data.message; 

      //Broadcast this message to all connected sockets
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "chatMessage",
              payload: savedMessage,
            })
          );
        }
      });
    } catch (err) {
      console.error("Error creating message via Laravel:", err.response?.data || err.message);
    }
  });

  // on disconnect
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start
server.listen(3001, () => {
  console.log("WebSocket chat server running on port 3001");
});
