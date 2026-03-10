<template>
  <el-container class="layout-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <el-icon size="48" class="loading-icon"><Loading /></el-icon>
      <p>加载中...</p>
    </div>
    
    <!-- 侧边栏 -->
    <el-aside 
      v-show="!isLoading && (!isMobile || isSidebarOpen)" 
      :width="isMobile ? '100%' : '260px'"
      class="sidebar"
      :class="{ 'sidebar-mobile': isMobile && isSidebarOpen }"
    >
      <div class="logo">
        <el-icon size="32"><Paw /></el-icon>
        <h2>动物管理系统</h2>
      </div>
      
      <el-menu
        :default-active="$route.path"
        class="menu"
        router
        :collapse="isCollapse && !isMobile"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/animals">
          <el-icon><Paw /></el-icon>
          <template #title>动物管理</template>
        </el-menu-item>
        
        <el-menu-item index="/categories">
          <el-icon><Grid /></el-icon>
          <template #title>分类管理</template>
        </el-menu-item>
        
        <el-menu-item index="/feeding">
          <el-icon><Food /></el-icon>
          <template #title>饲养记录</template>
        </el-menu-item>
        
        <el-menu-item index="/health">
          <el-icon><Medal /></el-icon>
          <template #title>健康监测</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container v-show="!isLoading">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button 
            @click="toggleSidebar" 
            :icon="isSidebarOpen ? 'Close' : 'Menu'" 
            circle
            size="small"
          />
          <h3>{{ currentPageTitle }}</h3>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleDropdownCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="User" />
              <span class="username">{{ authStore.username }}</span>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      
      <!-- 移动端遮罩 -->
      <div 
        v-if="isMobile && isSidebarOpen" 
        class="sidebar-overlay"
        @click="closeSidebar"
      />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  Menu, 
  Close, 
  Paw, 
  Odometer, 
  Grid, 
  Food, 
  Medal, 
  User, 
  CaretBottom,
  Loading
} from '@element-plus/icons-vue'

const authStore = useAuthStore()
const router = useRouter()

// 响应式布局
let isMobile = $ref(window.innerWidth < 768)
let isSidebarOpen = $ref(!isMobile)
let isCollapse = $ref(false)
let isLoading = $ref(!authStore.user && authStore.isAuthenticated)

// 监听用户信息加载状态
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser || !authStore.isAuthenticated) {
      isLoading = false
    }
  }
)

const currentPageTitle = computed(() => {
  const route = router.currentRoute.value
  return route.meta?.title || '仪表盘'
})

const handleResize = () => {
  isMobile = window.innerWidth < 768
  if (!isMobile) {
    isSidebarOpen = true
  }
}

const toggleSidebar = () => {
  if (isMobile) {
    isSidebarOpen = !isSidebarOpen
  } else {
    isCollapse = !isCollapse
  }
}

const closeSidebar = () => {
  if (isMobile) {
    isSidebarOpen = false
  }
}

const handleMenuSelect = () => {
  if (isMobile) {
    isSidebarOpen = false
  }
}

const handleDropdownCommand = (command: string) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  z-index: 9999;
  
  .loading-icon {
    color: #409eff;
    animation: rotate 1s linear infinite;
  }
  
  p {
    margin-top: 16px;
    color: #606266;
    font-size: 14px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.sidebar {
  background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
  transition: width 0.3s ease;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h2 {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  :deep(.el-menu) {
    border: none;
    background: transparent;
    
    .el-menu-item {
      color: rgba(255, 255, 255, 0.8);
      
      &:hover,
      &.is-active {
        background-color: rgba(255, 255, 255, 0.1);
        color: #409eff;
      }
      
      .el-icon {
        font-size: 18px;
      }
    }
  }
}

.sidebar-mobile {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  height: 100vh;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.header {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.main-content {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
}
</style>
