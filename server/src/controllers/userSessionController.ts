import userSessionStore from '../models/userSessionStore';
import { ID } from '../utilities/id';

const saveUserSession = (userId: string, socketId: string) => {
  userSessionStore.saveUserSession({ userId, socketId, sessionId: ID() });
};

const findUserSessionByUserId = (userId: string) => {
  userSessionStore.findUserSessionByUserId(userId);
};

const findUserSessionsByUserIds = (userIds: string[]) => {
  return userSessionStore.findUserSessionsByUserIds(userIds);
};

const deleteUserSession = (userId: string) => {
  userSessionStore.deleteUserSession(userId);
};

export default {
  saveUserSession,
  findUserSessionByUserId,
  findUserSessionsByUserIds,
  deleteUserSession,
};
