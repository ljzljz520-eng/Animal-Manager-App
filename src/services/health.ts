import api from './api'
import type { HealthRecord, PageResponse, PageRequest } from '@/types'

export const healthApi = {
  // 获取健康记录列表
  getList: async (params: PageRequest): Promise<PageResponse<HealthRecord>> => {
    return await api.get('/health-records', { params }) as unknown as PageResponse<HealthRecord>
  },
  
  // 创建健康记录
  create: async (data: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
    return await api.post('/health-records', data) as unknown as HealthRecord
  },
  
  // 更新健康记录
  update: async (id: number, data: Partial<HealthRecord>): Promise<HealthRecord> => {
    return await api.put(`/health-records/${id}`, data) as unknown as HealthRecord
  },
  
  // 删除健康记录
  delete: async (id: number): Promise<void> => {
    return await api.delete(`/health-records/${id}`) as unknown as void
  },
  
  // 获取动物的健康记录
  getByAnimalId: async (animalId: number): Promise<HealthRecord[]> => {
    return await api.get(`/health-records/animal/${animalId}`) as unknown as HealthRecord[]
  }
}
