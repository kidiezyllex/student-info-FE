export type TopicType =
  | "event"
  | "scholarship"
  | "notification"
  | "job"
  | "advertisement"
  | "internship"
  | "recruitment"
  | "volunteer"
  | "extracurricular"

export interface ITopicDepartment {
  _id: string
  name: string
  code: string
}

export interface ITopicCreatedBy {
  _id: string
  name: string
  role: string
}

export interface ITopic {
  _id: string
  title: string
  description: string
  type: TopicType
  department?: ITopicDepartment | null
  createdBy: ITopicCreatedBy
  startDate?: string
  endDate?: string
  applicationDeadline?: string
  location?: string
  organizer?: string
  requirements?: string
  value?: string
  provider?: string
  eligibility?: string
  applicationProcess?: string
  isImportant?: boolean
  company?: string
  salary?: string
  position?: string
  contactInfo?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ITopicListResponse {
  status: boolean
  message: string
  data: ITopic[]
  total: number
  page: number
  limit: number
  totalPages: number
  errors?: Record<string, any>
  timestamp: string
}

export interface ITopicResponse {
  status: boolean
  message: string
  data: ITopic
  errors?: Record<string, any>
  timestamp: string
}

