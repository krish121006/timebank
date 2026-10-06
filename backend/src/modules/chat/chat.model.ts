import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  text: string;
  read: boolean;
  createdAt: Date;
}

export interface IConversation extends Document {
  exchangeId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ConversationSchema = new Schema(
  {
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange', required: true, unique: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [MessageSchema]
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
