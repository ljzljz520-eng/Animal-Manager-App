import api from './api'
import type { LoginForm, User, LoginResponse } from '@/types'

export const authApi = {
  // 登录
  login: async (data: LoginForm): Promise<LoginResponse> => {
    return await api.post('/auth/login', data) as unknown as LoginResponse
  },
  
  // 获取用户信息
  getUserInfo: async (): Promise<User> => {
    return await api.get('/auth/userinfo') as unknown as User
  },
  
  // 登出
  logout: async (): Promise<void> => {
    return await api.post('/auth/logout') as unknown as void
  }
}
