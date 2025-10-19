import { WebSocketServer } from "ws";
import { Room } from "./rooms/room";
import verifySocketConnection from "./verification";

const PORT = Number(process.env.PORT);

const wss = new WebSocketServer({ port: PORT });

const room = new Room();

wss.on("connection", (socket, req) => {
  console.log("user connected");

  try {
    const user = verifySocketConnection(req);

    console.log(user);

    //@ts-ignore
    socket.userId = user.id;
    room.joinRoom(socket);

    socket.on("close", () => room.removeUser(socket));
  } catch (err) {
    console.log(err);
    socket.send(JSON.stringify({ type: "Error", message: err }));
    socket.close(1008, "Invalid token");
  }
});

console.log(`Server is running`);
