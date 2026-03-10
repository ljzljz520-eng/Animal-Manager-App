import api from './index'

export interface FeedingRecord {
  id: number
  animalId: number
  animalName?: string
  foodType: string
  quantity: number
  feedingTime: string
  feeder: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateFeedingRecordData {
  animalId: number
  foodType: string
  quantity: number
  feedingTime: string
  feeder: string
  notes?: string
}

export const getFeedingRecords = (params?: {
  page?: number
  pageSize?: number
  animalId?: number
  startDate?: string
  endDate?: string
}) => {
  return api.get<{ list: FeedingRecord[]; total: number }>('/feeding-records', { params })
}

export const getFeedingRecord = (id: number) => {
  return api.get<FeedingRecord>(`/feeding-records/${id}`)
}

export const createFeedingRecord = (data: CreateFeedingRecordData) => {
  return api.post<FeedingRecord>('/feeding-records', data)
}

export const updateFeedingRecord = (id: number, data: Partial<CreateFeedingRecordData>) => {
  return api.put<FeedingRecord>(`/feeding-records/${id}`, data)
}

export const deleteFeedingRecord = (id: number) => {
  return api.delete(`/feeding-records/${id}`)
}

export const getFeedingStats = () => {
  return api.get('/feeding-records/stats')
}
