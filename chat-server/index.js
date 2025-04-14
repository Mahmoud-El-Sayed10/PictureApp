const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("New client connected");
  socket.send("Hello from server!");

  socket.on("message", (msg) => {
    console.log("Client says:", msg);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
