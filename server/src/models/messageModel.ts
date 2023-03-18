import { ID } from '../utilities/id';
import mongoose from 'mongoose';
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

export interface NewMessage {
  fromUserId: string;
  conversationId: string;
  content?: string;
  timestamp: string;
}

const messageSchema = new mongoose.Schema({
  fromUserId: { type: String, required: true },
  conversationId: { type: String, required: true },
  content: String,
  timestamp: { type: String, required: true, default: Date.now },
});
const MessageModel = mongoose.model('Messages', messageSchema);

const testSave = () => {
  const data = new MessageModel({
    fromUserId: 'test3124',
    conversationId: 'test352523523',
  });
  data.save();
  console.log(data.id);
};

const findMessagesByConversationId = async (id: string) => {
  const data = await MessageModel.find({ conversationId: id });
  return data;
};

export default {
  saveMessage,
  getMessages: getMessagesbyId,
  messageModel: MessageModel,
  testSave,
  findMessagesByConversationId,
};
