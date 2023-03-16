interface ChatGroup {
  chatGroupId: string;
  userIds: string[];
}

const db = new Map<string, ChatGroup>();

const saveChatGroup = (chatGroup: ChatGroup) => {
  db.set(chatGroup.chatGroupId, chatGroup);
};

const findChatGroupByUserIds = (userIds: string[]): ChatGroup | undefined => {
  const chatGroup = Array.from(db.values())
    .filter((group) => group.userIds.length === userIds.length)
    .filter((group) => userIds.every((id) => group.userIds.includes(id)));
  return chatGroup[0] || undefined;
};

export default { saveChatGroup, findChatGroupByUserIds };
