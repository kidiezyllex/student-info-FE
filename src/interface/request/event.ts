export interface ICreateEventBody {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  department: string;
  organizer: string;
}

export interface IUpdateEventBody {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  department?: string;
  organizer?: string;
}

export interface IEventQueryParams {
  department?: string;
} 