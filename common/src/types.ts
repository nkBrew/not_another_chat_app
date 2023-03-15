export interface CreateRoomResponse {
  rooms: string[];
}

export interface Message {
  to: string;
  from: string;
  content: string;
}

export interface SocketUser {
  username: string;
  userId: string;
  socketId: string;
  rooms: Set<string>;
}
