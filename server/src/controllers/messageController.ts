import { Message } from '@not-another-chat-app/common';
import messages, { NewMessage } from '../models/messageModel';
import conversationStore from '../models/chatGroupModel';
import { ID } from '../utilities/id';

const saveMessage = (message: Message) => {
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

  const members = [message.from, message.to];
  conversationStore
    .findByMembers(members)
    .then((conversation) => {
      if (!conversation) {
        conversationStore.saveConversation('Private', members);
      }
      messages.saveMessage({ ...message, timestamp: Date.now() });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getMessages = (id: string) => {
  messages.getMessages(id);
};

const getMessagesByConversation = (id: string) => {
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

export default { saveMessage, getMessages };
