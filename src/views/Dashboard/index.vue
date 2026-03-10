<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.animalCount }}</h3>
              <p>动物总数</p>
            </div>
            <div class="stat-icon animal-icon">
              <el-icon size="28"><Paw /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.categoryCount }}</h3>
              <p>分类数量</p>
            </div>
            <div class="stat-icon category-icon">
              <el-icon size="28"><Grid /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.feedingCount }}</h3>
              <p>饲养记录</p>
            </div>
            <div class="stat-icon feeding-icon">
              <el-icon size="28"><Food /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <h3>{{ stats.healthyCount }}</h3>
              <p>健康动物</p>
            </div>
            <div class="stat-icon health-icon">
              <el-icon size="28"><Medal /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近活动 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <span class="card-title">最近添加的动物</span>
          </template>
          <el-table :data="recentAnimals" stripe>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="species" label="种类" />
            <el-table-column prop="healthStatus" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.healthStatus)" size="small">
                  {{ getStatusLabel(row.healthStatus) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <span class="card-title">最近饲养记录</span>
          </template>
          <el-table :data="recentFeedings" stripe>
            <el-table-column prop="animalName" label="动物" />
            <el-table-column prop="feedType" label="饲料" />
            <el-table-column prop="feedingTime" label="时间" width="100" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Paw, Grid, Food, Medal } from '@element-plus/icons-vue'

const stats = ref({
  animalCount: 156,
  categoryCount: 12,
  feedingCount: 892,
  healthyCount: 142
})

const recentAnimals = ref([
  { name: '大熊猫', species: '熊猫', healthStatus: 'healthy' },
  { name: '金丝猴', species: '猴子', healthStatus: 'healthy' },
  { name: '东北虎', species: '老虎', healthStatus: 'sick' },
  { name: '丹顶鹤', species: '鹤', healthStatus: 'healthy' }
])

const recentFeedings = ref([
  { animalName: '大熊猫', feedType: '竹子', feedingTime: '10:30' },
  { animalName: '金丝猴', feedType: '水果', feedingTime: '09:15' },
  { animalName: '东北虎', feedType: '牛肉', feedingTime: '08:00' },
  { animalName: '丹顶鹤', feedType: '小鱼', feedingTime: '11:00' }
])

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    healthy: 'success',
    sick: 'danger',
    injured: 'warning',
    quarantine: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    healthy: '健康',
    sick: '生病',
    injured: '受伤',
    quarantine: '隔离'
  }
  return labelMap[status] || status
}
</script>

<style scoped lang="scss">
.dashboard {
  .stats-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .stat-info {
        h3 {
          font-size: 32px;
          font-weight: 600;
          margin: 0 0 4px;
          color: #303133;
        }
        
        p {
          color: #909399;
          margin: 0;
          font-size: 14px;
        }
      }
      
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.animal-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        &.category-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        
        &.feeding-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        
        &.health-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }
      }
    }
  }
  
  .card-title {
    font-weight: 600;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .stat-card {
    .stat-content {
      .stat-info {
        h3 {
          font-size: 24px;
        }
      }
      
      .stat-icon {
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>
