export interface CreateRoomResponse {
  rooms: string[];
}

export interface Message {
  conversationId: string;
  fromUserId: string;
  content: string;
  timestamp: number;
}

export interface NewMessage {
  conversationId: string;
  fromUserId: string;
  content: string;
}

export interface SocketUser {
  username: string;
  userId: string;
  socketId: string;
  rooms: Set<string>;
}

export interface ConversationDto {
  conversationId: string;
  conversationName: string;
  memberIds: string[];
}

export interface UserBasic {
  userId: string;
  username: string;
  online: boolean;
}
