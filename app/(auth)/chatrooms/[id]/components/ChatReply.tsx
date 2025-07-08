interface Message {
  content: string;
  tags?: string[];
  sender: string;
}

interface ChatReplyProps {
  msg: Message;
  onCancel: () => void;
}

export function ChatReply({ msg, onCancel }: ChatReplyProps) {
  if (!msg.content || msg.content.length === 0) {
    return null;
  }

  return (
    <div
      style={{ fontSize: "0.85rem", backgroundColor: "#eee", padding: "6px" }}
    >
      ↪ <strong>{msg.sender}</strong>: {msg.content}
      <button onClick={onCancel} style={{ marginLeft: "8px" }}>
        ❌
      </button>
    </div>
  );
}
