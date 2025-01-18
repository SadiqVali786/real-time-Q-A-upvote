import { z } from "zod";

export enum SupportedMessage {
  JoinRoom = "JOIN_ROOM",
  SendMessage = "SEND_MESSAGE",
  UpvoteMessage = "UPVOTE_MESSAGE",
}

export const InitMessageSchema = z.object({
  fullname: z.string(),
  userId: z.string(),
  roomId: z.string(),
});

export const UserMessageSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
  message: z.string(),
});

export const UpvoteMessageSchema = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string(),
});
