import api from './api'
import type { Category, ApiResponse, PageResponse, PageRequest } from '@/types'

export const categoryApi = {
  // 获取分类列表
  getList: (params: PageRequest) => {
    return api.get<ApiResponse<PageResponse<Category>>>('/categories', { params })
  },
  
  // 获取所有分类
  getAll: () => {
    return api.get<ApiResponse<Category[]>>('/categories/all')
  },
  
  // 创建分类
  create: (data: Omit<Category, 'id' | 'animalCount' | 'createdAt'>) => {
    return api.post<ApiResponse<Category>>('/categories', data)
  },
  
  // 更新分类
  update: (id: number, data: Partial<Category>) => {
    return api.put<ApiResponse<Category>>(`/categories/${id}`, data)
  },
  
  // 删除分类
  delete: (id: number) => {
    return api.delete<ApiResponse<void>>(`/categories/${id}`)
  }
}
