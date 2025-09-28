export interface IConversation {
  userId: string;
  name: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface IGetConversationsResponse {
  message: string;
  data: IConversation[];
}

export interface IGetConversationHistoryResponse {
  message: string;
  data: IMessage[];
}

export interface ISendMessageResponse {
  message: string;
  data: IMessage;
}

export interface IMarkMessageAsReadResponse {
  message: string;
}

export interface IMarkAllMessagesAsReadResponse {
  message: string;
} 