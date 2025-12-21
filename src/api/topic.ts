import { sendGet, sendPost, sendPut, sendDelete } from "./axios"
import { ITopicListResponse, ITopicResponse } from "@/interface/response/topic"
import { ICreateTopicBody, IUpdateTopicBody, ITopicQueryParams } from "@/interface/request/topic"

export const getAllTopics = async (params: ITopicQueryParams = {}): Promise<ITopicListResponse> => {
  const res = await sendGet(`/topics`, params)
  return res
}

export const getAllTopicsAdmin = async (params: ITopicQueryParams = {}): Promise<ITopicListResponse> => {
  const res = await sendGet(`/topics/all`, params)
  return res
}

export const getTopicById = async (id: string): Promise<ITopicResponse> => {
  const res = await sendGet(`/topics/${id}`)
  return res
}

export const createTopic = async (body: ICreateTopicBody): Promise<ITopicResponse> => {
  const res = await sendPost(`/topics`, body)
  return res
}

export const updateTopic = async (id: string, body: IUpdateTopicBody): Promise<ITopicResponse> => {
  const res = await sendPut(`/topics/${id}`, body)
  return res
}

export const deleteTopic = async (id: string): Promise<ITopicResponse> => {
  const res = await sendDelete(`/topics/${id}`)
  return res
}

export const saveTopic = async (id: string): Promise<ITopicResponse> => {
  const res = await sendPut(`/topics/${id}/save`, {})
  return res
}

export const unsaveTopic = async (id: string): Promise<ITopicResponse> => {
  const res = await sendPut(`/topics/${id}/unsave`, {})
  return res
}

export const getSavedTopics = async (params: { page?: number; limit?: number } = {}): Promise<ITopicListResponse> => {
  const res = await sendGet(`/topics/saved`, params)
  return res
}

