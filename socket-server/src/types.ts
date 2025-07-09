export interface Chat {
  id?: number;
  content: string;
  tags?: string[];
  sender: string;
  replyToId?: number | null; // parent chat ID
}
