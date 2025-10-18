import Websocket from "ws";
import { CHAT, JOIN_ROOM } from "../lib/messages";
import { redisClient } from "../../../packages/redis/redis";
import { redis } from "bun";

interface Rooms {
  socket: Websocket;
  room: string;
}

let addToRoom: Rooms[] = [];

class Message {
  handleMessage(socket: any) {
    try {
      socket.on("message", async (message: any) => {
        const parsedMessage = JSON.parse(message.toString());

        if (parsedMessage.type == JOIN_ROOM) {
          console.log(`user Joined the room ${parsedMessage.payload.roomId}`);

          addToRoom.push({
            socket,
            room: parsedMessage.payload.roomId,
          });
        }

        if (parsedMessage.type == CHAT) {
          console.log("user want to chat");
          let currentUser = null;
          for (let i = 0; i < addToRoom.length; i++) {
            if (addToRoom[i]?.socket == socket) {
              currentUser = addToRoom[i]?.room;
            }
          }
          for (let i = 0; i < addToRoom.length; i++) {
            if (addToRoom[i]?.room == currentUser) {
              addToRoom[i]?.socket.send(parsedMessage.payload.message);
            }
          }
        }
      });
    } catch (err) {
      socket.close(4002, "unauthorized");
    }
  }
}

export const chat = new Message();
