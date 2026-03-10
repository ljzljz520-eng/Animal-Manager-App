<template>
  <div class="feeding-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>饲养记录</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            添加记录
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="动物">
            <el-select
              v-model="searchForm.animalId"
              placeholder="选择动物"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="animal in animals"
                :key="animal.id"
                :label="animal.name"
                :value="animal.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="searchForm.startDate"
              type="date"
              placeholder="选择开始日期"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="searchForm.endDate"
              type="date"
              placeholder="选择结束日期"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="feedingRecords"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="animalName" label="动物名称" min-width="100" />
        <el-table-column prop="foodType" label="食物类型" min-width="100" />
        <el-table-column prop="quantity" label="数量(kg)" width="100" />
        <el-table-column prop="feedingTime" label="喂食时间" width="160" />
        <el-table-column prop="feeder" label="喂食人" width="100" />
        <el-table-column prop="notes" label="备注" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)" size="small">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getFeedingRecords, deleteFeedingRecord, type FeedingRecord } from '../../api/feeding'
import { getAnimals, type Animal } from '../../api/animals'

const router = useRouter()

const loading = ref(false)
const feedingRecords = ref<FeedingRecord[]>([])
const animals = ref<Animal[]>([])
const total = ref(0)

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  animalId: null as number | null,
  startDate: '',
  endDate: ''
})

const loadFeedingRecords = async () => {
  loading.value = true
  try {
    const params = {
      page: searchForm.page,
      pageSize: searchForm.pageSize,
      animalId: searchForm.animalId || undefined,
      startDate: searchForm.startDate || undefined,
      endDate: searchForm.endDate || undefined
    }
    const response = await getFeedingRecords(params)
    feedingRecords.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('加载饲养记录失败:', error)
  } finally {
    loading.value = false
  }
}

const loadAnimals = async () => {
  try {
    const response = await getAnimals({ page: 1, pageSize: 1000 })
    animals.value = response.data.list
  } catch (error) {
    console.error('加载动物列表失败:', error)
  }
}

const handleSearch = () => {
  searchForm.page = 1
  loadFeedingRecords()
}

const handleReset = () => {
  searchForm.animalId = null
  searchForm.startDate = ''
  searchForm.endDate = ''
  searchForm.page = 1
  loadFeedingRecords()
}

const handleCreate = () => {
  router.push('/feeding/create')
}

const handleEdit = (row: FeedingRecord) => {
  router.push(`/feeding/${row.id}/edit`)
}

const handleDelete = async (row: FeedingRecord) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条饲养记录吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await deleteFeedingRecord(row.id)
    ElMessage.success('删除成功')
    loadFeedingRecords()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadAnimals()
  loadFeedingRecords()
})
</script>

<style scoped>
.feeding-list {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .search-bar .el-form {
    flex-direction: column;
  }

  .search-bar .el-form-item {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .search-bar .el-select,
  .search-bar .el-date-picker {
    width: 100% !important;
  }
}
</style>
