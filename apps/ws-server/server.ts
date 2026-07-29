import { WebSocketServer } from "ws";
import { Room } from "./rooms/room";
import verifySocketConnection from "./verification";
import { MusicHandler } from "./music/musicHandler";
import { MemoryStore } from "./memory/memoryStore";

const PORT = Number(process.env.PORT);

const wss = new WebSocketServer({ port: PORT });

const room = new Room();
const memoryStore = MemoryStore.getInstance();

await MusicHandler.initialize();

wss.on("connection", (socket, req) => {
  console.log("user connected");

  try {
    const user = verifySocketConnection(req);

    console.log(user);

    socket.userId = user.id;
    memoryStore.addUser(user.id, socket);
    room.joinRoom(socket);
    room.leaveRoom(socket);
    socket.on("close", () => {
      const userRooms = memoryStore.getUserRooms(user.id);
      memoryStore.removeUser(user.id, socket);
      room.removeUser(socket);
      for (const roomId of userRooms) {
        memoryStore.broadcastActiveMembers(roomId);
      }
    });
  } catch (err) {
    console.log(err);
    socket.send(JSON.stringify({ type: "Error", message: err }));
    socket.close(1008, "Invalid token");
  }
});

console.log(`Server is running`);
