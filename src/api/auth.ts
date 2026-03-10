import api from './index'

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
    avatar?: string
  }
}

export const login = (username: string, password: string) => {
  return api.post<LoginResponse>('/auth/login', { username, password })
}

export const logout = () => {
  return api.post('/auth/logout')
}

export const getCurrentUser = () => {
  return api.get('/auth/me')
}

export const changePassword = (oldPassword: string, newPassword: string) => {
  return api.post('/auth/change-password', { oldPassword, newPassword })
}
