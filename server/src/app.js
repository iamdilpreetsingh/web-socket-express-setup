import express from "express";
import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";

function main() {
  const application = express();
  application.use(express.urlencoded());
  application.use(express.json());
  const server = new Server(application);

  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("message", (data) => {
      console.log("Received message:", data);
      socket.emit("response", `Server got the data ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(8000, "127.0.0.1", () => {
    console.log(`Server listening at http://127.0.0.1:8000`);
  });
}

main();
