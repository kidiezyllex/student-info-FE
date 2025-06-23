export interface IAskAIBody {
  question: string;
  sessionId?: string;
  category?: string;
  departmentId?: string;
}

export interface IRateAIBody {
  sessionId: string;
  messageIndex: number;
  isAccurate: boolean;
} 