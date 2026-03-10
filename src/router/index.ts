import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/Layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'animals',
        name: 'Animals',
        component: () => import('@/views/Animals/index.vue'),
        meta: { title: '动物管理', icon: 'Paw' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories/index.vue'),
        meta: { title: '分类管理', icon: 'Grid' }
      },
      {
        path: 'feeding',
        name: 'Feeding',
        component: () => import('@/views/Feeding/index.vue'),
        meta: { title: '饲养记录', icon: 'Food' }
      },
      {
        path: 'health',
        name: 'Health',
        component: () => import('@/views/Health/index.vue'),
        meta: { title: '健康监测', icon: 'Medal' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // 不需要登录的页面
  if (to.meta.requiresAuth === false) {
    if (authStore.isAuthenticated && to.path === '/login') {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  // 需要登录的页面
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录')
    next('/login')
    return
  }
  
  // 已登录但没有用户信息，获取用户信息
  if (!authStore.user) {
    try {
      const success = await authStore.getUserInfo()
      if (!success) {
        // 先清除认证状态，再跳转
        authStore.logout()
        ElMessage.warning('登录已过期，请重新登录')
        next('/login')
        return
      }
    } catch (error) {
      // 捕获任何异常，确保不会卡住
      authStore.logout()
      ElMessage.error('获取用户信息失败，请重新登录')
      next('/login')
      return
    }
  }
  
  next()
})

export default router
