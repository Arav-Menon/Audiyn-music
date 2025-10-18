import { WebSocketServer } from "ws";
import { Room } from "./rooms/room";
import { JoinedMembers } from "./rooms/broadcast_member";
import { chat } from "./chat/chat";

const PORT = Number(process.env.PORT);

const wss = new WebSocketServer({ port: PORT });

const room = new Room();
const joinedMembers = new JoinedMembers();

wss.on("connection", (socket) => {
  console.log("user connected");

  try {
    // chat.handleMessage(socket);
    room.joinRoom(socket);

    // joinedMembers.member(socket);

    socket.on("close", () => room.removeUser(socket));
  } catch (err) {
    console.log(err);
    socket.send(JSON.stringify({ type: "Error", message: err }));
    socket.close(1008, "Invalid token");
  }
});

console.log(`Server is running`);
