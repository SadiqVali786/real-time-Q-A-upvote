import { ChatType, Store, UserIdType } from "./Store";

let globalChatId = 0;

export type RoomType = {
  roomId: string;
  chats: ChatType[];
};

export class InMemoryStore implements Store {
  private store: Map<string, RoomType>;

  constructor() {
    this.store = new Map<string, RoomType>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, { roomId, chats: [] });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    return room?.chats
      ? room.chats.slice(-offset - limit, -offset).reverse()
      : [];
  }

  addChat(roomId: string, userId: string, senderName: string, message: string) {
    if (!this.store.get(roomId)) {
      this.initRoom(roomId);
    }
    const room = this.store.get(roomId);
    if (!room) {
      return null;
    }
    const chat = {
      id: (globalChatId++).toString(),
      userId,
      senderName,
      message,
      upvotes: [],
    };
    room.chats.push(chat);
    return chat;
  }

  upvote(roomId: string, userId: UserIdType, chatId: string) {
    const room = this.store.get(roomId);
    if (!room) return;
    // TODO: make this faster
    const chat = room.chats.find(({ id }) => id === chatId);
    if (chat) {
      if (chat.upvotes.find((id) => id === userId)) {
        return chat;
      }
      chat.upvotes.push(userId);
    }
    return chat;
  }
}
