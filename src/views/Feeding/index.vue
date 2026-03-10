<template>
  <div class="feeding-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>饲养记录管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon>
            添加记录
          </el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索动物名称或饲料类型"
          style="max-width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-date-picker
          v-model="searchDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="animalName" label="动物名称" />
        <el-table-column prop="feedType" label="饲料类型" />
        <el-table-column prop="feedAmount" label="投喂量(kg)" width="120" />
        <el-table-column prop="feedingTime" label="投喂时间" width="160" />
        <el-table-column prop="feeder" label="饲养员" />
        <el-table-column prop="notes" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
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
      :title="isEdit ? '编辑饲养记录' : '添加饲养记录'"
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
            <el-form-item label="动物" prop="animalId">
              <el-select v-model="formData.animalId" placeholder="请选择动物" style="width: 100%" filterable>
                <el-option
                  v-for="animal in animals"
                  :key="animal.id"
                  :label="animal.name"
                  :value="animal.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="饲料类型" prop="feedType">
              <el-input v-model="formData.feedType" placeholder="请输入饲料类型" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投喂量(kg)" prop="feedAmount">
              <el-input-number v-model="formData.feedAmount" :min="0" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投喂时间" prop="feedingTime">
              <el-date-picker
                v-model="formData.feedingTime"
                type="datetime"
                placeholder="选择投喂时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="饲养员" prop="feeder">
          <el-input v-model="formData.feeder" placeholder="请输入饲养员姓名" />
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
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
import { Plus, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { FeedingRecord, Animal } from '@/types'
import { feedingApi } from '@/services/feeding'
import { animalApi } from '@/services/animal'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const tableData = ref<FeedingRecord[]>([])
const animals = ref<Animal[]>([])
const total = ref(0)

const searchKeyword = ref('')
const searchDate = ref<string | null>(null)

const pageParams = reactive({
  page: 1,
  pageSize: 10
})

const formData = reactive<Partial<FeedingRecord>>({
  animalId: undefined,
  animalName: '',
  feedType: '',
  feedAmount: 0,
  feedingTime: dayjs().format('YYYY-MM-DD HH:mm'),
  feeder: '',
  notes: ''
})

const formRules: FormRules = {
  animalId: [{ required: true, message: '请选择动物', trigger: 'change' }],
  feedType: [{ required: true, message: '请输入饲料类型', trigger: 'blur' }],
  feedAmount: [{ required: true, message: '请输入投喂量', trigger: 'blur' }],
  feedingTime: [{ required: true, message: '请选择投喂时间', trigger: 'change' }],
  feeder: [{ required: true, message: '请输入饲养员姓名', trigger: 'blur' }]
}

// 获取饲养记录列表
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const response = await feedingApi.getList({
    //   ...pageParams,
    //   keyword: searchKeyword.value
    // })
    // tableData.value = response.data.list
    // total.value = response.data.total
    
    // 模拟数据
    tableData.value = [
      { id: 1, animalId: 1, animalName: '大熊猫', feedType: '竹子', feedAmount: 15.5, feedingTime: '2024-03-10 09:00', feeder: '张师傅', notes: '新鲜竹子' },
      { id: 2, animalId: 2, animalName: '金丝猴', feedType: '水果', feedAmount: 2.5, feedingTime: '2024-03-10 09:30', feeder: '李师傅', notes: '苹果、香蕉' },
      { id: 3, animalId: 3, animalName: '东北虎', feedType: '牛肉', feedAmount: 8.0, feedingTime: '2024-03-10 10:00', feeder: '王师傅', notes: '新鲜牛肉' },
      { id: 4, animalId: 1, animalName: '大熊猫', feedType: '竹笋', feedAmount: 5.0, feedingTime: '2024-03-10 14:00', feeder: '张师傅', notes: '春季竹笋' },
      { id: 5, animalId: 4, animalName: '丹顶鹤', feedType: '小鱼', feedAmount: 1.5, feedingTime: '2024-03-10 11:00', feeder: '刘师傅', notes: '鲜活小鱼' }
    ]
    total.value = 892
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 获取动物列表
const fetchAnimals = async () => {
  try {
    // const response = await animalApi.getList({ page: 1, pageSize: 1000 })
    // animals.value = response.data.list
    
    // 模拟数据
    animals.value = [
      { id: 1, name: '大熊猫', species: '熊猫', breed: '', age: 5, gender: 'male', categoryId: 1, healthStatus: 'healthy', description: '', createdAt: '', updatedAt: '' },
      { id: 2, name: '金丝猴', species: '猴子', breed: '', age: 3, gender: 'female', categoryId: 1, healthStatus: 'healthy', description: '', createdAt: '', updatedAt: '' },
      { id: 3, name: '东北虎', species: '老虎', breed: '', age: 4, gender: 'male', categoryId: 2, healthStatus: 'sick', description: '', createdAt: '', updatedAt: '' },
      { id: 4, name: '丹顶鹤', species: '鹤', breed: '', age: 2, gender: 'female', categoryId: 2, healthStatus: 'healthy', description: '', createdAt: '', updatedAt: '' }
    ]
  } catch (error) {
    ElMessage.error('获取动物列表失败')
  }
}

const handleSearch = () => {
  pageParams.page = 1
  fetchData()
}

const handlePageChange = () => {
  fetchData()
}

const openDialog = (row?: FeedingRecord) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, {
    animalId: undefined,
    animalName: '',
    feedType: '',
    feedAmount: 0,
    feedingTime: dayjs().format('YYYY-MM-DD HH:mm'),
    feeder: '',
    notes: ''
  })
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        // 获取选中动物的名称
        const selectedAnimal = animals.value.find(a => a.id === formData.animalId)
        if (selectedAnimal) {
          formData.animalName = selectedAnimal.name
        }
        
        if (isEdit.value && formData.id) {
          // await feedingApi.update(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          // await feedingApi.create(formData as any)
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

const handleDelete = async (row: FeedingRecord) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条饲养记录吗？`,
      '确认删除',
      { type: 'warning' }
    )
    // await feedingApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  fetchData()
  fetchAnimals()
})
</script>

<style scoped lang="scss">
.feeding-page {
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
}

@media (max-width: 768px) {
  .feeding-page {
    .search-bar {
      flex-direction: column;
      
      :deep(.el-input),
      :deep(.el-date-editor) {
        width: 100% !important;
        max-width: none !important;
      }
    }
  }
}
</style>
