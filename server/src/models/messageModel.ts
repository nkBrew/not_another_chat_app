import { ID } from '../utilities/id';

interface MessageModel {
  from: string;
  content: string;
  to: string;
  timestamp: number;
}

const db: Map<string, MessageModel> = new Map();

const saveMessage = (message: MessageModel) => {
  db.set(ID(), message);
};

const getMessagesbyId = (id: string) => {
  return db.get(id);
};

const getMessagesByUserId = (userId: string) => {
  return Array.from(db.values()).filter(
    (msg) => msg.from === userId || msg.to === userId,
  );
};

export default { saveMessage, getMessages: getMessagesbyId };
