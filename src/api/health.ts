import api from './index'

export interface HealthRecord {
  id: number
  animalId: number
  animalName?: string
  checkType: string
  checkDate: string
  result: string
  veterinarian: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateHealthRecordData {
  animalId: number
  checkType: string
  checkDate: string
  result: string
  veterinarian: string
  notes?: string
}

export const getHealthRecords = (params?: {
  page?: number
  pageSize?: number
  animalId?: number
  checkType?: string
  startDate?: string
  endDate?: string
}) => {
  return api.get<{ list: HealthRecord[]; total: number }>('/health-records', { params })
}

export const getHealthRecord = (id: number) => {
  return api.get<HealthRecord>(`/health-records/${id}`)
}

export const createHealthRecord = (data: CreateHealthRecordData) => {
  return api.post<HealthRecord>('/health-records', data)
}

export const updateHealthRecord = (id: number, data: Partial<CreateHealthRecordData>) => {
  return api.put<HealthRecord>(`/health-records/${id}`, data)
}

export const deleteHealthRecord = (id: number) => {
  return api.delete(`/health-records/${id}`)
}

export const getHealthStats = () => {
  return api.get('/health-records/stats')
}
