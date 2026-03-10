<template>
  <div class="animal-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>动物列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            添加动物
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索动物名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="searchForm.categoryId"
              placeholder="选择分类"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="健康状态">
            <el-select
              v-model="searchForm.healthStatus"
              placeholder="选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="健康" value="healthy" />
              <el-option label="生病" value="sick" />
              <el-option label="受伤" value="injured" />
              <el-option label="隔离" value="quarantine" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="animals"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              {{ row.name?.charAt(0)?.toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="100" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="species" label="物种" width="120" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === 'male' ? 'primary' : 'danger'">
              {{ row.gender === 'male' ? '公' : '母' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="体重(kg)" width="100" />
        <el-table-column prop="healthStatus" label="健康状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.healthStatus)">
              {{ getStatusText(row.healthStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button @click="handleView(row)" size="small">查看</el-button>
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
import { getAnimals, deleteAnimal, type Animal } from '../../api/animals'
import { getAllCategories, type Category } from '../../api/categories'

const router = useRouter()

const loading = ref(false)
const animals = ref<Animal[]>([])
const categories = ref<Category[]>([])
const total = ref(0)

const searchForm = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  categoryId: null as number | null,
  healthStatus: ''
})

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    healthy: 'success',
    sick: 'danger',
    injured: 'warning',
    quarantine: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    healthy: '健康',
    sick: '生病',
    injured: '受伤',
    quarantine: '隔离'
  }
  return texts[status] || status
}

const loadAnimals = async () => {
  loading.value = true
  try {
    const params = {
      page: searchForm.page,
      pageSize: searchForm.pageSize,
      keyword: searchForm.keyword || undefined,
      categoryId: searchForm.categoryId || undefined,
      healthStatus: searchForm.healthStatus || undefined
    }
    const response = await getAnimals(params)
    animals.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('加载动物列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await getAllCategories()
    categories.value = response.data
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

const handleSearch = () => {
  searchForm.page = 1
  loadAnimals()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.categoryId = null
  searchForm.healthStatus = ''
  searchForm.page = 1
  loadAnimals()
}

const handleCreate = () => {
  router.push('/animals/create')
}

const handleView = (row: Animal) => {
  // TODO: 查看详情弹窗
  console.log('View animal:', row)
}

const handleEdit = (row: Animal) => {
  router.push(`/animals/${row.id}/edit`)
}

const handleDelete = async (row: Animal) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除动物"${row.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await deleteAnimal(row.id)
    ElMessage.success('删除成功')
    loadAnimals()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadCategories()
  loadAnimals()
})
</script>

<style scoped>
.animal-list {
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

  .search-bar .el-input,
  .search-bar .el-select {
    width: 100% !important;
  }
}
</style>
