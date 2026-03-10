<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :lg="12">
        <el-card title="动物分类统计" shadow="hover">
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card title="健康状态分布" shadow="hover">
          <div ref="healthChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="recent-row">
      <el-col :xs="24" :lg="12">
        <el-card title="最近饲养记录" shadow="hover">
          <el-table :data="recentFeeding" stripe>
            <el-table-column prop="animalName" label="动物名称" />
            <el-table-column prop="foodType" label="食物类型" />
            <el-table-column prop="quantity" label="数量(kg)" />
            <el-table-column prop="feedingTime" label="时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card title="最近健康检查" shadow="hover">
          <el-table :data="recentHealth" stripe>
            <el-table-column prop="animalName" label="动物名称" />
            <el-table-column prop="checkType" label="检查类型" />
            <el-table-column prop="result" label="结果" />
            <el-table-column prop="checkDate" label="日期" width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getAnimalStats } from '../api/animals'
import { getFeedingRecords } from '../api/feeding'
import { getHealthRecords } from '../api/health'

const categoryChartRef = ref<HTMLElement | null>(null)
const healthChartRef = ref<HTMLElement | null>(null)

let categoryChart: echarts.ECharts | null = null
let healthChart: echarts.ECharts | null = null

const stats = ref([
  { title: '动物总数', value: 0, icon: 'Tickets', color: '#3498db' },
  { title: '分类数量', value: 0, icon: 'Grid', color: '#2ecc71' },
  { title: '健康记录', value: 0, icon: 'FirstAidKit', color: '#e74c3c' },
  { title: '饲养记录', value: 0, icon: 'CoffeeCup', color: '#f39c12' }
])

const recentFeeding = ref<any[]>([])
const recentHealth = ref<any[]>([])

const loadStats = async () => {
  try {
    const response = await getAnimalStats()
    const data = response.data
    stats.value[0].value = data.totalAnimals || 0
    stats.value[1].value = data.totalCategories || 0
    stats.value[2].value = data.totalHealthRecords || 0
    stats.value[3].value = data.totalFeedingRecords || 0
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadRecentData = async () => {
  try {
    const [feedingRes, healthRes] = await Promise.all([
      getFeedingRecords({ page: 1, pageSize: 5 }),
      getHealthRecords({ page: 1, pageSize: 5 })
    ])
    recentFeeding.value = feedingRes.data.list || []
    recentHealth.value = healthRes.data.list || []
  } catch (error) {
    console.error('加载最近数据失败:', error)
  }
}

const initCharts = () => {
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c} ({d}%)' },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' }
        },
        data: [
          { value: 15, name: '哺乳动物', itemStyle: { color: '#3498db' } },
          { value: 12, name: '鸟类', itemStyle: { color: '#2ecc71' } },
          { value: 8, name: '爬行动物', itemStyle: { color: '#e74c3c' } },
          { value: 5, name: '两栖动物', itemStyle: { color: '#f39c12' } },
          { value: 3, name: '鱼类', itemStyle: { color: '#9b59b6' } }
        ]
      }]
    })
  }

  if (healthChartRef.value) {
    healthChart = echarts.init(healthChartRef.value)
    healthChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {c} ({d}%)' },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' }
        },
        data: [
          { value: 35, name: '健康', itemStyle: { color: '#2ecc71' } },
          { value: 5, name: '生病', itemStyle: { color: '#e74c3c' } },
          { value: 2, name: '受伤', itemStyle: { color: '#f39c12' } },
          { value: 1, name: '隔离', itemStyle: { color: '#9b59b6' } }
        ]
      }]
    })
  }
}

const handleResize = () => {
  categoryChart?.resize()
  healthChart?.resize()
}

onMounted(() => {
  loadStats()
  loadRecentData()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  categoryChart?.dispose()
  healthChart?.dispose()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.recent-row {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
