export interface CreateRoomResponse {
  rooms: string[];
}

export interface Message {
  to: string;
  from: string;
  content: string;
}

export interface SocketUser {
  name: string;
  userId: string;
  socketId: string;
  rooms: Set<string>;
}
