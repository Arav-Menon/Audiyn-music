import { WebSocketServer } from "ws";
import { Room } from "./room";

const port = 8080;

const wss = new WebSocketServer({ port });

const room = new Room();

wss.on("connection", (socket) => {
  console.log("User connected");

  room.addUser(socket);

  socket.on("disconnect", () => room.removeUser(socket));
});

console.log(`Server is running`);
