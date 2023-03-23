import mongoose from 'mongoose';

export interface ConversationDocument {
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
