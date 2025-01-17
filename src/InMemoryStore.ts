import { ChatType, Store, UserIdType } from "./store/Store";

let globalChatId = 0;

type RoomType = {
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
    const room = this.store.get(roomId);
    if (room) {
      room.chats.push({
        id: (globalChatId++).toString(),
        userId,
        senderName,
        message,
        upvotes: [],
      });
    }
  }

  upvote(roomId: string, userId: UserIdType, chatId: string) {
    const room = this.store.get(roomId);
    if (room) {
      // TODO: make this faster
      const chat = room.chats.find(({ id }) => id === chatId);
      if (chat) {
        chat.upvotes.push(userId);
      }
    }
  }
}
