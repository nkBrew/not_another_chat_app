interface UserSession {
  sessionId: string;
  userId: string;
  socketId: string;
}

const db = new Map<string, UserSession>();

const saveUserSession = (session: UserSession) => {
  db.set(session.userId, session);
};

const findUserSessionByUserId = (userId: string) => {
  return db.get(userId);
};

const deleteUserSession = (userId: string) => {
  db.delete(userId);
};

export default { saveUserSession, findUserSessionByUserId, deleteUserSession };
