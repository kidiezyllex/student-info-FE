import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllTopics,
  getAllTopicsAdmin,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  saveTopic,
  unsaveTopic,
  getSavedTopics,
} from "@/api/topic"
import {
  ITopicListResponse,
  ITopicResponse,
} from "@/interface/response/topic"
import {
  ICreateTopicBody,
  IUpdateTopicBody,
  ITopicQueryParams,
} from "@/interface/request/topic"

export const useGetTopics = (params: ITopicQueryParams = {}) => {
  return useQuery<ITopicListResponse, Error>({
    queryKey: ["topics", params],
    queryFn: () => getAllTopics(params),
  })
}

export const useGetTopicsAdmin = (params: ITopicQueryParams = {}) => {
  return useQuery<ITopicListResponse, Error>({
    queryKey: ["topics-admin", params],
    queryFn: () => getAllTopicsAdmin(params),
  })
}

export const useGetTopicById = (id: string) => {
  return useQuery<ITopicResponse, Error>({
    queryKey: ["topics", id],
    queryFn: () => getTopicById(id),
    enabled: !!id,
  })
}

export const useCreateTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ITopicResponse, Error, ICreateTopicBody>({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics-admin"] })
    },
  })
}

export const useUpdateTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ITopicResponse, Error, { id: string; data: IUpdateTopicBody }>({
    mutationFn: ({ id, data }) => updateTopic(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics-admin"] })
      queryClient.invalidateQueries({ queryKey: ["topics", variables.id] })
    },
  })
}

export const useDeleteTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ITopicResponse, Error, string>({
    mutationFn: deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics-admin"] })
    },
  })
}

export const useSaveTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ITopicResponse, Error, string>({
    mutationFn: saveTopic,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["topics", id] })
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics-admin"] })
      queryClient.invalidateQueries({ queryKey: ["saved-topics"] })
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] })
    },
  })
}

export const useUnsaveTopic = () => {
  const queryClient = useQueryClient()

  return useMutation<ITopicResponse, Error, string>({
    mutationFn: unsaveTopic,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["topics", id] })
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics-admin"] })
      queryClient.invalidateQueries({ queryKey: ["saved-topics"] })
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] })
    },
  })
}

export const useGetSavedTopics = (page: number = 1, limit: number = 10) => {
  return useQuery<ITopicListResponse, Error>({
    queryKey: ["saved-topics", page, limit],
    queryFn: () => getSavedTopics({ page, limit }),
  })
}

