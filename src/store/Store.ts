export type UserIdType = string;

export type ChatType = {
  id: string;
  userId: UserIdType;
  senderName: string;
  message: string;
  upvotes: UserIdType[]; // who has upvoted what
};

export abstract class Store {
  constructor() {}

  initRoom(roomId: string) {}

  getChats(roomId: string, limit: number, offset: number) {}

  addChat(
    roomId: string,
    userId: string,
    senderName: string,
    message: string
  ) {}

  upvote(roomId: string, userId: UserIdType, chatId: string) {}
}
