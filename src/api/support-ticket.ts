import { sendGet, sendPost, sendPut, sendDelete } from './axios';
import { 
  ICreateSupportTicketResponse, 
  IGetSupportTicketsResponse, 
  IGetSupportTicketDetailResponse,
  IUpdateTicketStatusResponse,
  IAddTicketNoteResponse,
  IResolveTicketResponse,
  IAssignTicketResponse,
  IDeleteTicketResponse,
  ITicketStatsResponse
} from '@/interface/response/support-ticket';
import { 
  ICreateSupportTicketBody, 
  IUpdateTicketStatusBody, 
  IAddTicketNoteBody, 
  IResolveTicketBody, 
  IAssignTicketBody,
  IGetSupportTicketsParams
} from '@/interface/request/support-ticket';

const BASE_URL = '/support-tickets';

export const createSupportTicket = (data: ICreateSupportTicketBody): Promise<ICreateSupportTicketResponse> => {
  return sendPost(BASE_URL, data);
};

export const getSupportTickets = (params?: IGetSupportTicketsParams): Promise<IGetSupportTicketsResponse> => {
  return sendGet(BASE_URL, params);
};

export const getSupportTicketById = (id: string): Promise<IGetSupportTicketDetailResponse> => {
  return sendGet(`${BASE_URL}/${id}`);
};

export const updateTicketStatus = (id: string, data: IUpdateTicketStatusBody): Promise<IUpdateTicketStatusResponse> => {
  return sendPut(`${BASE_URL}/${id}/status`, data);
};

export const addTicketNote = (id: string, data: IAddTicketNoteBody): Promise<IAddTicketNoteResponse> => {
  return sendPost(`${BASE_URL}/${id}/notes`, data);
};

export const resolveTicket = (id: string, data: IResolveTicketBody): Promise<IResolveTicketResponse> => {
  return sendPut(`${BASE_URL}/${id}/resolve`, data);
};

export const assignTicket = (id: string, data: IAssignTicketBody): Promise<IAssignTicketResponse> => {
  return sendPut(`${BASE_URL}/${id}/assign`, data);
};

export const deleteTicket = (id: string): Promise<IDeleteTicketResponse> => {
  return sendDelete(`${BASE_URL}/${id}`);
};

export const getTicketStats = (): Promise<ITicketStatsResponse> => {
  return sendGet(`${BASE_URL}/stats`);
};
