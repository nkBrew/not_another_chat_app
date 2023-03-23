import {
  ConversationDto,
  Message,
  NewMessage,
} from '@not-another-chat-app/common';
import { MessageModel, MessageDocument } from '../models/messageModel';

import { UsersModel } from '../models/usersModel';
import {
  ConversationDocument,
  ConversationModel,
} from '../models/conversationModel';

export const saveMessage = async (message: NewMessage) => {
  const convoDoc = await ConversationModel.findById(message.conversationId);
  if (!convoDoc) {
    return;
  }

  const data = new MessageModel({ ...message, timestamp: Date.now() });
  data.save();

  return message;
};

export const getConversationById = async (id: string) => {
  const doc = await ConversationModel.findById(id);
  if (!doc) {
    return;
  }
  return deserializeConversation(doc);
};

export const getMessagesByConversationId = async (id: string) => {
  const data = await MessageModel.find({ conversationId: id }).sort({
    timestamp: -1,
  });

  if (!data) {
    return [];
  }
  const foundMessages: Message[] = data.map((d) => deserializeMessage(d));
  return foundMessages;
};

export const getUserConversations = async (userId: string) => {
  const documents = await ConversationModel.find({ members: userId });
  const conversations = documents.map((doc) => ({
    conversationId: doc.id,
    conversationName: doc.name,
    memberIds: doc.members,
  }));
  return conversations;
};

const deserializeMessage = (doc: MessageDocument) => {
  const { conversationId, content, fromUserId, timestamp, id } = doc;
  const message: Message = { conversationId, content, fromUserId, timestamp };
  console.log(message);
  return message;
};

const deserializeConversation = (doc: ConversationDocument) => {
  const conversation: ConversationDto = {
    conversationId: doc.id,
    conversationName: doc.name,
    memberIds: doc.members,
  };
  return conversation;
};

//Currently Just create a new conversation for each new User. Won't work at a large scale but my app will never be big
export const createConversationsForNewUser = async (newUserId: string) => {
  const userDocs = await UsersModel.find();
  console.log(`found users ${userDocs.map((doc) => doc.username)}`);

  const pmConversations = userDocs.map((doc) => ({
    name: 'Private',
    members: [...new Set([newUserId, doc.id])].sort(),
  }));
  ConversationModel.insertMany(pmConversations);
};

// const getMatchingUserConversations = async (userIds: string[]) => {
//   const documents = await ConversationModel.find({ members: { $in: userIds } });
//   const conversations = documents.map((doc) => ({
//     conversationId: doc.id,
//     name: doc.name,
//     members: doc.members,
//   }));
//   return conversations;
// };
