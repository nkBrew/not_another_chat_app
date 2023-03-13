import messages from '../models/messageModel';

interface Message {
  from: string;
  msg: string;
  room: string;
}

const saveMessage = (message: Message) => {
  messages.saveMessage(message);
};

const getMessages = (id: string) => {
  messages.getMessages(id);
};

export default { saveMessage, getMessages };
