export interface IChatMessage {
  role: string;
  content: string;
  isAccurate?: boolean;
}

export interface IChatSession {
  _id: string;
  title: string;
  user: string;
  createdAt: string;
  lastActive: string;
  messages: IChatMessage[];
}

export interface IChatHistoryItem {
  _id: string;
  title: string;
  lastActive: string;
  createdAt: string;
}

export interface IAskAIResponse {
  success: boolean;
  data: {
    sessionId: string;
    title: string;
    question: string;
    answer: string;
    message: any;
  };
}

export interface IGetChatHistoryResponse {
  success: boolean;
  count: number;
  data: IChatHistoryItem[];
}

export interface IGetChatSessionResponse {
  success: boolean;
  data: IChatSession;
}

export interface IRateAIResponse {
  success: boolean;
  message: string;
}

export interface IDeleteChatSessionResponse {
  success: boolean;
  message: string;
} 