import { ID } from '../utilities/id';
import db from '../models/userSessionModel';

export const saveUserSession = (userId: string, socketId: string) => {
  const session = { userId, socketId, sessionId: ID() };
  db.set(userId, session);
};

export const findUserSessionByUserId = (userId: string) => {
  return db.get(userId);
};

export const findUserSessionsByUserIds = (userIds: string[]) => {
  const found = Array.from(db.values()).filter((val) =>
    userIds.includes(val.userId),
  );
  return found;
};

export const deleteUserSession = (userId: string) => {
  db.delete(userId);
};
