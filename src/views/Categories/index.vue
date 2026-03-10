<template>
  <div class="categories-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称"
          style="max-width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <!-- 分类卡片列表 -->
      <el-row :gutter="20">
        <el-col 
          v-for="item in tableData" 
          :key="item.id"
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
          style="margin-bottom: 20px"
        >
          <el-card class="category-card" hoverable>
            <div class="category-header">
              <div class="category-icon">
                <el-icon size="32"><Grid /></el-icon>
              </div>
              <div class="category-actions">
                <el-button size="small" link @click="openDialog(item)">编辑</el-button>
                <el-button size="small" link type="danger" @click="handleDelete(item)">删除</el-button>
              </div>
            </div>
            
            <h3 class="category-name">{{ item.name }}</h3>
            <p class="category-desc">{{ item.description || '暂无描述' }}</p>
            
            <div class="category-footer">
              <span class="animal-count">
                <el-icon size="14"><Paw /></el-icon>
                {{ item.animalCount }} 只动物
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pageParams.page"
          v-model:page-size="pageParams.pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '添加分类'"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Grid, Paw } from '@element-plus/icons-vue'
import type { Category } from '@/types'
import { categoryApi } from '@/services/category'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const tableData = ref<Category[]>([])
const total = ref(0)
const searchKeyword = ref('')

const pageParams = reactive({
  page: 1,
  pageSize: 12
})

const formData = reactive<Partial<Category>>({
  name: '',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 获取分类列表
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const response = await categoryApi.getList({
    //   ...pageParams,
    //   keyword: searchKeyword.value
    // })
    // tableData.value = response.data.list
    // total.value = response.data.total
    
    // 模拟数据
    tableData.value = [
      { id: 1, name: '哺乳动物', description: '恒温、胎生的脊椎动物', animalCount: 80, createdAt: '2024-01-01' },
      { id: 2, name: '鸟类', description: '有羽毛、卵生的脊椎动物', animalCount: 45, createdAt: '2024-01-02' },
      { id: 3, name: '爬行动物', description: '冷血、卵生的脊椎动物', animalCount: 31, createdAt: '2024-01-03' },
      { id: 4, name: '两栖动物', description: '水陆两栖的脊椎动物', animalCount: 18, createdAt: '2024-01-04' },
      { id: 5, name: '鱼类', description: '水生、用鳃呼吸的脊椎动物', animalCount: 52, createdAt: '2024-01-05' },
      { id: 6, name: '昆虫', description: '节肢动物门昆虫纲', animalCount: 120, createdAt: '2024-01-06' }
    ]
    total.value = 12
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageParams.page = 1
  fetchData()
}

const handlePageChange = () => {
  fetchData()
}

const openDialog = (row?: Category) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
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
          // await categoryApi.update(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          // await categoryApi.create(formData as any)
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

const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类「${row.name}」吗？删除后该分类下的动物将被移至未分类。`,
      '确认删除',
      { type: 'warning' }
    )
    // await categoryApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.categories-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .category-card {
    height: 100%;
    
    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      
      .category-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
    
    .category-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #303133;
    }
    
    .category-desc {
      color: #909399;
      font-size: 14px;
      margin: 0 0 16px;
      line-height: 1.5;
      height: 42px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .category-footer {
      border-top: 1px solid #ebeef5;
      padding-top: 12px;
      
      .animal-count {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #606266;
        font-size: 14px;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .categories-page {
    .search-bar {
      :deep(.el-input) {
        width: 100% !important;
        max-width: none !important;
      }
    }
  }
}
</style>
