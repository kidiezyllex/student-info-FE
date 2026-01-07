export interface ICreateSupportTicketBody {
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'academic' | 'technical' | 'administrative' | 'other';
  aiConversation?: {
    userQuery: string;
    aiResponse: string;
    conversationId: string;
  };
  contactInfo?: {
    email: string;
    phoneNumber: string;
  };
}

export interface IUpdateTicketStatusBody {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface IAddTicketNoteBody {
  note: string;
}

export interface IResolveTicketBody {
  resolutionNote: string;
}

export interface IAssignTicketBody {
  adminId: string;
}

export interface IGetSupportTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  department?: string;
}
