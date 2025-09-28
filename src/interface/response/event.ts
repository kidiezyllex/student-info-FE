export interface IEventDepartment {
  _id: string;
  name: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  department: IEventDepartment;
  organizer: string;
  requirements?: string;
  agenda?: string;
}

export interface IEventCreate {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  department: string;
  organizer: string;
}

export interface IGetUpcomingEventsResponse {
  message: string;
  data: IEvent[];
}

export interface IGetAllEventsResponse {
  message: string;
  data: IEvent[];
}

export interface IGetEventByIdResponse {
  message: string;
  data: IEvent;
}

export interface ICreateEventResponse {
  message: string;
  data: IEventCreate;
}

export interface IUpdateEventResponse {
  message: string;
  data: IEventCreate;
}

export interface IDeleteEventResponse {
  message: string;
} 