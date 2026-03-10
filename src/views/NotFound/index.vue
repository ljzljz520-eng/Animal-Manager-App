<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.not-found-content {
  text-align: center;
  
  h1 {
    font-size: 120px;
    font-weight: 700;
    color: #409eff;
    margin: 0;
    line-height: 1;
  }
  
  h2 {
    font-size: 24px;
    color: #303133;
    margin: 20px 0 10px;
  }
  
  p {
    color: #909399;
    margin-bottom: 30px;
  }
}
</style>
