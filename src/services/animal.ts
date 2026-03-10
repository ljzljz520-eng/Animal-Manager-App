import api from './api'
import type { Animal, ApiResponse, PageResponse, PageRequest } from '@/types'

export const animalApi = {
  // 获取动物列表
  getList: (params: PageRequest) => {
    return api.get<ApiResponse<PageResponse<Animal>>>('/animals', { params })
  },
  
  // 获取动物详情
  getDetail: (id: number) => {
    return api.get<ApiResponse<Animal>>(`/animals/${id}`)
  },
  
  // 创建动物
  create: (data: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => {
    return api.post<ApiResponse<Animal>>('/animals', data)
  },
  
  // 更新动物
  update: (id: number, data: Partial<Animal>) => {
    return api.put<ApiResponse<Animal>>(`/animals/${id}`, data)
  },
  
  // 删除动物
  delete: (id: number) => {
    return api.delete<ApiResponse<void>>(`/animals/${id}`)
  }
}
