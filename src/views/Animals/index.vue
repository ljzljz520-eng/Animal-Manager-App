<template>
  <div class="animals-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>动物信息管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon>
            添加动物
          </el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索动物名称或种类"
          style="max-width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="searchCategory"
          placeholder="选择分类"
          clearable
          style="width: 150px"
          @change="handleSearch"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        
        <el-select
          v-model="searchStatus"
          placeholder="健康状态"
          clearable
          style="width: 120px"
          @change="handleSearch"
        >
          <el-option label="全部" value="" />
          <el-option label="健康" value="healthy" />
          <el-option label="生病" value="sick" />
          <el-option label="受伤" value="injured" />
          <el-option label="隔离" value="quarantine" />
        </el-select>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="species" label="种类" />
        <el-table-column prop="breed" label="品种" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === 'male' ? 'primary' : 'danger'" size="small">
              {{ row.gender === 'male' ? '公' : '母' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthStatus" label="健康状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.healthStatus)" size="small">
              {{ getStatusLabel(row.healthStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">查看</el-button>
            <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pageParams.page"
          v-model:page-size="pageParams.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑动物' : '添加动物'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入动物名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种类" prop="species">
              <el-input v-model="formData.species" placeholder="请输入种类" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品种" prop="breed">
              <el-input v-model="formData.breed" placeholder="请输入品种" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="formData.age" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%">
                <el-option label="公" value="male" />
                <el-option label="母" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="cat in categories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="健康状态" prop="healthStatus">
          <el-select v-model="formData.healthStatus" placeholder="请选择健康状态">
            <el-option label="健康" value="healthy" />
            <el-option label="生病" value="sick" />
            <el-option label="受伤" value="injured" />
            <el-option label="隔离" value="quarantine" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="动物详情" width="500px">
      <div v-if="currentAnimal" class="detail-content">
        <p><strong>名称:</strong> {{ currentAnimal.name }}</p>
        <p><strong>种类:</strong> {{ currentAnimal.species }}</p>
        <p><strong>品种:</strong> {{ currentAnimal.breed }}</p>
        <p><strong>年龄:</strong> {{ currentAnimal.age }} 岁</p>
        <p><strong>性别:</strong> {{ currentAnimal.gender === 'male' ? '公' : '母' }}</p>
        <p><strong>健康状态:</strong> 
          <el-tag :type="getStatusTagType(currentAnimal.healthStatus)" size="small">
            {{ getStatusLabel(currentAnimal.healthStatus) }}
          </el-tag>
        </p>
        <p><strong>描述:</strong> {{ currentAnimal.description || '暂无' }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { Animal, Category } from '@/types'
import { animalApi } from '@/services/animal'
import { categoryApi } from '@/services/category'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentAnimal = ref<Animal | null>(null)

const tableData = ref<Animal[]>([])
const categories = ref<Category[]>([])
const total = ref(0)

const searchKeyword = ref('')
const searchCategory = ref<number | ''>('')
const searchStatus = ref<string | ''>('')

const pageParams = reactive({
  page: 1,
  pageSize: 10
})

const formData = reactive<Partial<Animal>>({
  name: '',
  species: '',
  breed: '',
  age: 0,
  gender: 'male',
  categoryId: undefined,
  healthStatus: 'healthy',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入动物名称', trigger: 'blur' }],
  species: [{ required: true, message: '请输入种类', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 获取动物列表
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const response = await animalApi.getList({
    //   ...pageParams,
    //   keyword: searchKeyword.value
    // })
    // tableData.value = response.data.list
    // total.value = response.data.total
    
    // 模拟数据
    tableData.value = [
      { id: 1, name: '大熊猫', species: '熊猫', breed: '四川大熊猫', age: 5, gender: 'male', categoryId: 1, healthStatus: 'healthy', description: '国宝大熊猫', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: 2, name: '金丝猴', species: '猴子', breed: '川金丝猴', age: 3, gender: 'female', categoryId: 1, healthStatus: 'healthy', description: '', createdAt: '2024-02-20', updatedAt: '2024-02-20' },
      { id: 3, name: '东北虎', species: '老虎', breed: '西伯利亚虎', age: 4, gender: 'male', categoryId: 2, healthStatus: 'sick', description: '感冒治疗中', createdAt: '2024-03-10', updatedAt: '2024-03-10' }
    ]
    total.value = 156
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    // const response = await categoryApi.getAll()
    // categories.value = response.data
    
    // 模拟数据
    categories.value = [
      { id: 1, name: '哺乳动物', description: '', animalCount: 80, createdAt: '' },
      { id: 2, name: '鸟类', description: '', animalCount: 45, createdAt: '' },
      { id: 3, name: '爬行动物', description: '', animalCount: 31, createdAt: '' }
    ]
  } catch (error) {
    ElMessage.error('获取分类失败')
  }
}

const handleSearch = () => {
  pageParams.page = 1
  fetchData()
}

const handlePageChange = () => {
  fetchData()
}

const openDialog = (row?: Animal) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'male',
    categoryId: undefined,
    healthStatus: 'healthy',
    description: ''
  })
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value && formData.id) {
          // await animalApi.update(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          // await animalApi.create(formData as any)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleDelete = async (row: Animal) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除动物「${row.name}」吗？`,
      '确认删除',
      { type: 'warning' }
    )
    // await animalApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

const viewDetail = (row: Animal) => {
  currentAnimal.value = row
  detailVisible.value = true
}

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

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>

<style scoped lang="scss">
.animals-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .detail-content {
    p {
      margin: 12px 0;
      line-height: 1.6;
    }
  }
}

@media (max-width: 768px) {
  .animals-page {
    .search-bar {
      flex-direction: column;
      
      :deep(.el-input),
      :deep(.el-select) {
        width: 100% !important;
        max-width: none !important;
      }
    }
  }
}
</style>
