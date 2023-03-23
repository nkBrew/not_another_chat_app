import mongoose, { Document } from 'mongoose';

export interface ConversationDocument extends Document {
  id: string;
  name: string;
  members: string[];
}

const conversationSchema = new mongoose.Schema<ConversationDocument>({
  name: { type: String, required: true },
  members: { type: [String] },
});

export const ConversationModel = mongoose.model(
  'Conversations',
  conversationSchema,
);
