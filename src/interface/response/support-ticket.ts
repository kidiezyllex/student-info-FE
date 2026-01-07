export interface ISupportTicket {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  department: {
    _id: string;
    name: string;
    code: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  aiConversation?: {
    userQuery: string;
    aiResponse: string;
    conversationId: string;
  };
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'academic' | 'technical' | 'administrative' | 'other';
  contactInfo?: {
    email: string;
    phoneNumber: string;
  };
  adminNotes: {
    admin: {
      _id: string;
      name: string;
    };
    note: string;
    createdAt: string;
  }[];
  resolution?: {
    resolvedBy: {
      _id: string;
      name: string;
    };
    resolvedAt: string;
    resolutionNote: string;
  };
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ICreateSupportTicketResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IGetSupportTicketsResponse {
  status: boolean;
  message: string;
  data: ISupportTicket[] | {
    docs: ISupportTicket[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export interface IGetSupportTicketDetailResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IUpdateTicketStatusResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IAddTicketNoteResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IResolveTicketResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IAssignTicketResponse {
  status: boolean;
  message: string;
  data: ISupportTicket;
}

export interface IDeleteTicketResponse {
  status: boolean;
  message: string;
}

export interface ITicketStatsResponse {
  status: boolean;
  message: string;
  data: {
    total: number;
    byStatus: { _id: string; count: number }[];
    byPriority: { _id: string; count: number }[];
    byCategory: { _id: string; count: number }[];
  };
}
