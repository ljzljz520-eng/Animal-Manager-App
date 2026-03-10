import api from './index'

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  avatar?: string
}

export const getUsers = (params?: {
  page?: number
  pageSize?: number
  role?: string
  keyword?: string
}) => {
  return api.get<{ list: User[]; total: number }>('/users', { params })
}

export const getUser = (id: number) => {
  return api.get<User>(`/users/${id}`)
}

export const createUser = (data: CreateUserData) => {
  return api.post<User>('/users', data)
}

export const updateUser = (id: number, data: Partial<CreateUserData>) => {
  return api.put<User>(`/users/${id}`, data)
}

export const deleteUser = (id: number) => {
  return api.delete(`/users/${id}`)
}

export const updateUserStatus = (id: number, status: 'active' | 'inactive') => {
  return api.patch(`/users/${id}/status`, { status })
}
