import mongoose from 'mongoose';

// interface ChatGroup {
//   chatGroupId: string;
//   userIds: string[];
// }
// const db = new Map<string, ChatGroup>();

// const saveChatGroup = (chatGroup: ChatGroup) => {
//   db.set(chatGroup.chatGroupId, chatGroup);
// };

// const findChatGroupByUserIds = (userIds: string[]): ChatGroup | undefined => {
//   const chatGroup = Array.from(db.values())
//     .filter((group) => group.userIds.length === userIds.length)
//     .filter((group) => userIds.every((id) => group.userIds.includes(id)));
//   return chatGroup[0] || undefined;
// };

interface Conversation {
  id: string;
  name: string;
  members: string[];
}

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: [String] },
});

export const ConversationModel = mongoose.model(
  'Conversations',
  conversationSchema,
);

const saveConversation = (name: string, members: string[]) => {
  const data = new ConversationModel({ name, members: [...members.sort()] });
  data.save();
  const conversation: Conversation = { id: data.id, name, members };
  return conversation;
};

const findById = async (id: string) => {
  const data = ConversationModel.findById(id);
};

const findByMembers = async (
  members: string[],
): Promise<Conversation | undefined> => {
  const sortedMembers = [...members.sort()];
  const data = await ConversationModel.findOne({
    members: sortedMembers,
  });

  if (!data) {
    return undefined;
  }

  return { id: data.id, members: data.members, name: data.name };
};

export default {
  // saveChatGroup,
  // findChatGroupByUserIds,
  saveConversation,
  findByMembers,
};
