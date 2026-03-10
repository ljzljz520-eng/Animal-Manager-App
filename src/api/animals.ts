import api from './index'

export interface Animal {
  id: number
  name: string
  categoryId: number
  categoryName?: string
  species: string
  age: number
  gender: 'male' | 'female'
  weight: number
  healthStatus: 'healthy' | 'sick' | 'injured' | 'quarantine'
  description?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnimalData {
  name: string
  categoryId: number
  species: string
  age: number
  gender: 'male' | 'female'
  weight: number
  healthStatus: 'healthy' | 'sick' | 'injured' | 'quarantine'
  description?: string
  avatar?: string
}

export const getAnimals = (params?: {
  page?: number
  pageSize?: number
  categoryId?: number
  healthStatus?: string
  keyword?: string
}) => {
  return api.get<{ list: Animal[]; total: number }>('/animals', { params })
}

export const getAnimal = (id: number) => {
  return api.get<Animal>(`/animals/${id}`)
}

export const createAnimal = (data: CreateAnimalData) => {
  return api.post<Animal>('/animals', data)
}

export const updateAnimal = (id: number, data: Partial<CreateAnimalData>) => {
  return api.put<Animal>(`/animals/${id}`, data)
}

export const deleteAnimal = (id: number) => {
  return api.delete(`/animals/${id}`)
}

export const getAnimalStats = () => {
  return api.get('/animals/stats')
}
