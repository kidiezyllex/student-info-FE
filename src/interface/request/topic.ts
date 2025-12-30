import { TopicType } from "../response/topic"

export interface ITopicQueryParams {
  type?: TopicType
  department?: string
  page?: number
  limit?: number
  status?: "all" | "active" | "expired" // For filtering by expiration status
  search?: string // For searching by title or description
  sort?: string
  order?: "asc" | "desc"
  hasDeadline?: boolean
}

export interface ICreateTopicBody {
  title: string
  description: string
  type: TopicType
  department?: string | null
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
}

export interface IUpdateTopicBody extends Partial<ICreateTopicBody> {}

