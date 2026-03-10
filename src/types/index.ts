// 用户类型
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  token: string
}

// 登录表单类型
export interface LoginForm {
  username: string
  password: string
}

// 登录响应类型
export interface LoginResponse {
  token: string
  user: User
}

// 动物类型
export interface Animal {
  id: number
  name: string
  species: string
  breed: string
  age: number
  gender: 'male' | 'female'
  categoryId: number
  healthStatus: 'healthy' | 'sick' | 'injured' | 'quarantine'
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  description: string
  animalCount: number
  createdAt: string
}

// 饲养记录类型
export interface FeedingRecord {
  id: number
  animalId: number
  animalName: string
  feedType: string
  feedAmount: number
  feedingTime: string
  feeder: string
  notes: string
}

// 健康记录类型
export interface HealthRecord {
  id: number
  animalId: number
  animalName: string
  checkDate: string
  temperature: number
  weight: number
  symptoms: string
  diagnosis: string
  treatment: string
  veterinarian: string
  nextCheckDate?: string
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页请求类型
export interface PageRequest {
  page: number
  pageSize: number
  keyword?: string
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
