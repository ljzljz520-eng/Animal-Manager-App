import api from './index'

export interface Category {
  id: number
  name: string
  description?: string
  animalCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export const getCategories = (params?: {
  page?: number
  pageSize?: number
  keyword?: string
}) => {
  return api.get<{ list: Category[]; total: number }>('/categories', { params })
}

export const getAllCategories = () => {
  return api.get<Category[]>('/categories/all')
}

export const getCategory = (id: number) => {
  return api.get<Category>(`/categories/${id}`)
}

export const createCategory = (data: CreateCategoryData) => {
  return api.post<Category>('/categories', data)
}

export const updateCategory = (id: number, data: Partial<CreateCategoryData>) => {
  return api.put<Category>(`/categories/${id}`, data)
}

export const deleteCategory = (id: number) => {
  return api.delete(`/categories/${id}`)
}
