import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'animals',
        name: 'Animals',
        component: () => import('../views/animals/AnimalList.vue')
      },
      {
        path: 'animals/create',
        name: 'AnimalCreate',
        component: () => import('../views/animals/AnimalForm.vue')
      },
      {
        path: 'animals/:id/edit',
        name: 'AnimalEdit',
        component: () => import('../views/animals/AnimalForm.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/categories/CategoryList.vue')
      },
      {
        path: 'feeding',
        name: 'Feeding',
        component: () => import('../views/feeding/FeedingList.vue')
      },
      {
        path: 'feeding/create',
        name: 'FeedingCreate',
        component: () => import('../views/feeding/FeedingForm.vue')
      },
      {
        path: 'health',
        name: 'Health',
        component: () => import('../views/health/HealthList.vue')
      },
      {
        path: 'health/create',
        name: 'HealthCreate',
        component: () => import('../views/health/HealthForm.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/UserList.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
