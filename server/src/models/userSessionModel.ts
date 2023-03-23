export interface UserSession {
  sessionId: string;
  userId: string;
  socketId: string;
}

export const db = new Map<string, UserSession>();

export default db;
