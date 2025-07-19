// ✅ 채팅 메시지 데이터 구조
export interface Message {
  id?: number; // 메시지 ID (DB에서 자동 생성됨)
  content: string; // 메시지 본문
  tags?: string[]; // 해시태그 목록
  sender: string; // 작성자 이름
  senderId?: number; //작성자 id
  senderNickname?: string; // 작성자 닉네임
  sentAt?: string; // 메시지 전송 시간 (ISO 8601 형식)
  replyToId?: number | null; // 답글 대상 메시지 ID (없으면 null)
  parentChatId?: number | null;
}

export interface pMessage {
  id?: number; // 메시지 ID (DB에서 자동 생성됨)
  content: string; // 메시지 본문
  tags?: string[]; // 해시태그 목록
  sender: string; // 작성자 이름
  senderId?: number; //작성자 id
  senderNickname?: string; // 작성자 닉네임
  sent_at?: string; // 메시지 전송 시간 (ISO 8601 형식)
  replyToId?: number | null; // 답글 대상 메시지 ID (없으면 null)
  parentChatId?: number | null;
}

// ✅ 답글 컴포넌트 Props
export interface ChatReplyProps {
  msg: Message; // 답글 대상 메시지
  onCancel: () => void; // 답글 취소 콜백
}

// ✅ 채팅 입력창 Props
export interface ChatInputProps {
  onSend: (content: string, tags: string[], replyTo?: Message | null) => void; // 메시지 전송
  replyTo: Message | null; // 답글 대상 메시지
  onCancelReply: () => void; // 답글 취소 콜백
}

// ✅ 채팅 로그 목록 Props
export interface ChatLogProps {
  messages: Message[]; // 렌더링할 메시지 리스트
  onReply: (msg: Message) => void; // 메시지 클릭 시 답글 시작
  currentUserId: number | null; //유저 id
}

