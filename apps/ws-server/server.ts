import { WebSocketServer } from "ws";
import { Room } from "./rooms/room";
import { JoinedMembers } from "./rooms/broadcast_member";

const port = 8080;

const wss = new WebSocketServer({ port });

const room = new Room();
const joinedMembers = new JoinedMembers();

wss.on("connection", (socket) => {
  room.joinRoom(socket);

  joinedMembers.member(socket);

  socket.on("close", () => room.removeUser(socket));
});

console.log(`Server is running`);
