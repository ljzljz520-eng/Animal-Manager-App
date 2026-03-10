import api from './api'
import type { FeedingRecord, ApiResponse, PageResponse, PageRequest } from '@/types'

export const feedingApi = {
  // 获取饲养记录列表
  getList: (params: PageRequest) => {
    return api.get<ApiResponse<PageResponse<FeedingRecord>>>('/feeding-records', { params })
  },
  
  // 创建饲养记录
  create: (data: Omit<FeedingRecord, 'id'>) => {
    return api.post<ApiResponse<FeedingRecord>>('/feeding-records', data)
  },
  
  // 更新饲养记录
  update: (id: number, data: Partial<FeedingRecord>) => {
    return api.put<ApiResponse<FeedingRecord>>(`/feeding-records/${id}`, data)
  },
  
  // 删除饲养记录
  delete: (id: number) => {
    return api.delete<ApiResponse<void>>(`/feeding-records/${id}`)
  },
  
  // 获取动物的饲养记录
  getByAnimalId: (animalId: number) => {
    return api.get<ApiResponse<FeedingRecord[]>>(`/feeding-records/animal/${animalId}`)
  }
}
