export enum SupportedOutgoingMessageTypes {
  AddChat = "ADD_CHAT",
  UpdateChat = "UPDATE_CHAT",
}

type OutgoingMessagePayloadType = {
  roomId: string;
  chatId: string;
  message: string;
  fullname: string;
  upvotes: number;
};

export type OutgoingMessageType =
  | {
      type: SupportedOutgoingMessageTypes.AddChat;
      payload: OutgoingMessagePayloadType;
    }
  | {
      type: SupportedOutgoingMessageTypes.UpdateChat;
      payload: Partial<OutgoingMessagePayloadType>;
    };
