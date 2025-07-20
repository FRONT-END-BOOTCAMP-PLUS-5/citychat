import { Message } from "../types";

export function AdaptChatFromSupabase(raw: Message): Message {
  return {
    id: raw.id,
    content: raw.content,
    tags: raw.tags,
    sender: raw.sender,
    senderId: raw.senderId,
    senderNickname: raw.senderNickname,
    sentAt: raw.sentAt,
    replyToId: raw.replyToId ?? raw.parentChatId ?? null,
  };
}

