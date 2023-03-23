import { ID } from '../utilities/id';
import mongoose, { Document } from 'mongoose';

export interface MessageDocument extends Document {
  fromUserId: string;
  conversationId: string;
  content: string;
  timestamp: number;
}

const messageSchema = new mongoose.Schema<MessageDocument>({
  fromUserId: { type: String, required: true },
  conversationId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
});
export const MessageModel = mongoose.model('Messages', messageSchema);
