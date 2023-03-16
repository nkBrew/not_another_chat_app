import userSessionStore from '../models/userSessionStore';
import { ID } from '../utilities/id';

const saveUserSession = (userId: string, socketId: string) => {
  userSessionStore.saveUserSession({ userId, socketId, sessionId: ID() });
};

const findUserSessionByUserId = (userId: string) => {
  userSessionStore.findUserSessionByUserId(userId);
};

const deleteUserSession = (userId: string) => {
  userSessionStore.deleteUserSession(userId);
};

export default { saveUserSession, findUserSessionByUserId, deleteUserSession };
