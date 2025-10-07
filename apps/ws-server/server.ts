import { WebSocketServer } from "ws";
import { Room } from "./room";
import jwt, { type JwtPayload } from "jsonwebtoken";

const port = 8080;

const wss = new WebSocketServer({ port });

const room = new Room();

wss.on("connection", (socket, req) => {
  console.log("user is live");

  const params = new URLSearchParams(req.url?.split("?")[1]);
  const token = params.get("token");

  if (!token) {
    socket.close(4001, "unauthorized");
    return;
  }

  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as JwtPayload;

  (socket as any).userId = decoded.id;

  room.joinRoom(socket);

  socket.on("disconnect", () => room.removeUser(socket));
});

console.log(`Server is running`);
