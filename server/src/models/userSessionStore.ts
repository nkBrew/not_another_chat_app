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

const findUserSessionsByUserIds = (userIds: string[]) => {
  const found = Array.from(db.values()).filter((val) =>
    userIds.includes(val.userId),
  );
  return found;
};

const deleteUserSession = (userId: string) => {
  db.delete(userId);
};

export default {
  saveUserSession,
  findUserSessionByUserId,
  findUserSessionsByUserIds,
  deleteUserSession,
};
