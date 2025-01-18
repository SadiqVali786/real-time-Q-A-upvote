import { WebSocket, WebSocketServer } from "ws";
import {
  InitMessageSchema,
  SupportedMessage,
  UpvoteMessageSchema,
  UserMessageSchema,
} from "./messages/incomingMessages";
import { z } from "zod";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/InMemoryStore";
import {
  OutgoingMessageType,
  SupportedOutgoingMessageTypes,
} from "./messages/outgoingMessages";

const userManager = new UserManager();
const store = new InMemoryStore();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    // TODO: add rate limitting logic here
    // console.log("received: %s", data);
    try {
      messageHandler(ws, JSON.parse(data.toString()));
    } catch (error) {
      console.error(error);
    }
  });

  ws.send("something");
});

type IncomingMessageType =
  | {
      type: SupportedMessage.JoinRoom;
      payload: z.infer<typeof InitMessageSchema>;
    }
  | {
      type: SupportedMessage.SendMessage;
      payload: z.infer<typeof UserMessageSchema>;
    }
  | {
      type: SupportedMessage.UpvoteMessage;
      payload: z.infer<typeof UpvoteMessageSchema>;
    };

const messageHandler = (ws: WebSocket, message: IncomingMessageType) => {
  if (message.type === SupportedMessage.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.fullname, payload.userId, payload.roomId, ws);
  } else if (message.type === SupportedMessage.SendMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.error("user not found in the DB");
      return;
    }
    const chat = store.addChat(
      payload.roomId,
      payload.userId,
      user?.fullname!,
      payload.message
    );
    if (!chat) return;
    // TODO: add broadcast logic here
    const outgoingPayload: OutgoingMessageType = {
      type: SupportedOutgoingMessageTypes.AddChat,
      payload: {
        chatId: chat?.id,
        fullname: user.fullname,
        message: payload.message,
        roomId: payload.roomId,
        upvotes: 0,
      },
    };
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
  } else if (message.type === SupportedMessage.UpvoteMessage) {
    const payload = message.payload;
    const chat = store.upvote(payload.roomId, payload.userId, payload.chatId);
    if (!chat) return;
    const outgoingPayload: OutgoingMessageType = {
      type: SupportedOutgoingMessageTypes.UpdateChat,
      payload: {
        chatId: chat?.id,
        roomId: payload.roomId,
        upvotes: chat.upvotes.length,
      },
    };
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
  }
};
