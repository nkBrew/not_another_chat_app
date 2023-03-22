import { ConversationDto, Message } from '@not-another-chat-app/common';
import messages, { MessageModel, NewMessage } from '../models/messageModel';
import conversationStore, {
  Conversation,
  ConversationModel,
} from '../models/chatGroupModel';
import { ID } from '../utilities/id';
import { UsersModel } from '../models/usersModel';

const saveMessage = async (message: Message) => {
  // const chatGroup = chatGroupsStore.findChatGroupByUserIds([
  //   message.from,
  //   message.to,
  // ]) || {
  //   chatGroupId: ID(),
  //   userIds: [message.from, message.to],
  // };
  // if (!chatGroup) {
  //   chatGroupsStore.saveChatGroup(chatGroup);
  // }

  const convoDoc = await ConversationModel.findById(message.conversationId);
  if (!convoDoc) {
    return;
  }

  message.timestamp = Date.now();
  const data = new MessageModel({ ...message });
  data.save();

  return message;
  // const coversation: ConversationDto = {
  //   conversationId: convoDoc.id,
  //   memberIds: convoDoc.members,
  //   conversationName: convoDoc.name,
  // };
  // .findByMembers(members)
  // .then((conversation) => {
  //   if (!conversation) {
  //     const conversation = conversationStore.saveConversation(
  //       'Private',
  //       members,
  //     );
  //   }
  //   messages.saveMessage({ ...message, timestamp: Date.now() });
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
};

const getConversationById = async (id: string) => {
  const doc = await ConversationModel.findById(id);
  if (!doc) {
    return;
  }
  // deserialize(doc);
  // const conversation: ConversationDto = deserialize(doc);
  return deserialize(doc);
};

const deserialize = (doc: Conversation) => {
  const conversation: ConversationDto = {
    conversationId: doc.id,
    conversationName: doc.name,
    memberIds: doc.members,
  };
  return conversation;
};

const getMessages = (id: string) => {
  messages.getMessages(id);
};

const getMessagesByConversationId = (id: string) => {
  return messages.findMessagesByConversationId(id).then((data) => {
    if (!data) {
      return [];
    }
    const foundMessages: NewMessage[] = data.map((d) => ({
      id: d.id,
      fromUserId: d.fromUserId,
      conversationId: d.conversationId,
      content: d.content,
      timestamp: d.timestamp,
    }));
    return foundMessages;
  });
};

const getUserConversations = async (userId: string) => {
  const documents = await ConversationModel.find({ members: userId });
  const conversations = documents.map((doc) => ({
    conversationId: doc.id,
    conversationName: doc.name,
    memberIds: doc.members,
  }));
  return conversations;
};

const getMatchingUserConversations = async (userIds: string[]) => {
  const documents = await ConversationModel.find({ members: { $in: userIds } });
  const conversations = documents.map((doc) => ({
    conversationId: doc.id,
    name: doc.name,
    members: doc.members,
  }));
  return conversations;
};

//Currently Just create a new conversation for each new User. Won't work at a large scale but my app will never be big
const createConversationsForNewUser = async (newUserId: string) => {
  const userDocs = await UsersModel.find();
  console.log(`found users ${userDocs.map((doc) => doc.username)}`);

  const pmConversations = userDocs.map((doc) => ({
    name: 'Private',
    members: [...new Set([newUserId, doc.id])].sort(),
  }));
  ConversationModel.insertMany(pmConversations);
};

export default {
  saveMessage,
  getMessages,
  getMessagesByConversationId,
  getUserConversations,
  getMatchingUserConversations,
  createConversationsForNewUser,
  getConversationById,
};
