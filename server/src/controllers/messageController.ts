import { Message } from '@not-another-chat-app/common';
import messages from '../models/messageModel';
import chatGroupsStore from '../models/chatGroupModel';
import { ID } from '../utilities/id';

const saveMessage = (message: Message) => {
  const chatGroup = chatGroupsStore.findChatGroupByUserIds([
    message.from,
    message.to,
  ]) || {
    chatGroupId: ID(),
    userIds: [message.from, message.to],
  };
  if (!chatGroup) {
    chatGroupsStore.saveChatGroup(chatGroup);
  }

  messages.saveMessage({ ...message, timestamp: Date.now() });
};

const getMessages = (id: string) => {
  messages.getMessages(id);
};

export default { saveMessage, getMessages };
