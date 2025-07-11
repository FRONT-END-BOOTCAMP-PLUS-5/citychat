// import { MessageRepository } from "@/backend/domain/repositories/MessageRepository";
// import { Message } from "@/backend/domain/entities/Message";
// import { createClient } from "@/lib/supabase"; // 예시

// export class SbMessageRepository implements MessageRepository {
//   private supabase = createClient();

//   async searchByTag(tag: string): Promise<Message[]> {
//     const { data } = await this.supabase
//       .from("tags")
//       .select("message_id, messages(content, sender_id, sent_at)")
//       .eq("tag", tag);
//     return data as Message[];
//   }

//   async searchByText(text: string): Promise<Message[]> {
//     const { data } = await this.supabase
//       .from("messages")
//       .select("*")
//       .ilike("content", `%${text}%`);
//     return data as Message[];
//   }
// }
