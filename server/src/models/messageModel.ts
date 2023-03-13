interface MessageModel {
  from: string;
  msg: string;
  room: string;
}

const db: Map<string, MessageModel> = new Map();

const saveMessage = (message: MessageModel) => {
  db.set(message.room, message);
};

const getMessages = (id: string) => {
  return db.get(id);
};

export default { saveMessage, getMessages };
