import { defineStore } from 'pinia'
import type { User, LoginForm } from '@/types'
import { authApi } from '@/services/auth'
import { ElMessage } from 'element-plus'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    username: (state) => state.user?.username || ''
  },
  
  actions: {
    async login(loginForm: LoginForm) {
      try {
        const response = await authApi.login(loginForm)
        const { token, user } = response
        this.token = token
        this.user = user
        this.isAuthenticated = true
        localStorage.setItem('token', token)
        ElMessage.success('登录成功')
        return true
      } catch (error) {
        ElMessage.error('登录失败')
        return false
      }
    },
    
    async getUserInfo() {
      try {
        const response = await authApi.getUserInfo()
        this.user = response
        return true
      } catch (error) {
        return false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
    },
    
    hasPermission(permission: string) {
      if (!this.user) return false
      if (this.user.role === 'admin') return true
      
      const userPermissions = ['view', 'edit']
      return userPermissions.includes(permission)
    }
  }
})
