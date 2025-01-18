import { WebSocket } from "ws";
import {
  OutgoingMessageType,
  SupportedOutgoingMessageTypes,
} from "./messages/outgoingMessages";

type User = {
  fullname: string;
  id: string;
  socket: WebSocket;
};

type Room = {
  users: User[];
};

export class UserManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  addUser(fullname: string, userId: string, roomId: string, socket: WebSocket) {
    if (!this.rooms.get(userId)) {
      this.rooms.set(roomId, { users: [] });
    }
    this.rooms.get(roomId)?.users.push({ fullname, id: userId, socket });
  }

  removeUser(roomId: string, userId: string) {
    let users = this.rooms.get(roomId)?.users;
    if (users) {
      users = users.filter(({ id }) => id !== userId);
    }
  }

  getUser(roomId: string, userId: string): User | null {
    const user = this.rooms.get(roomId)?.users.find(({ id }) => id === userId);
    return user ?? null;
  }

  broadcast(roomId: string, userId: string, message: OutgoingMessageType) {
    const user = this.getUser(roomId, userId);
    if (!user) {
      console.error("user not found");
      return;
    }
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("room not found");
      return;
    }

    room.users.forEach(({ socket }) => {
      socket.send(JSON.stringify(message));
    });
  }
}
