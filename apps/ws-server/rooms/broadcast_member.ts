import WebSocket from "ws";

export class JoinedMembers {
  member(socket: WebSocket) {
    this.joinedMemberHandler(socket);
  }

  private joinedMemberHandler(socket: WebSocket) {
    try {
    
        

    } catch (err) {
      socket.close(4002, "unauthorized");
    }
  }
}
