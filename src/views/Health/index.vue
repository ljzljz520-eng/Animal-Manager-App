<template>
  <div class="health-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>健康监测管理</span>
          <el-button type="primary" @click="openDialog()">
            <el-icon><Plus /></el-icon>
            添加健康记录
          </el-button>
        </div>
      </template>
      
      <!-- 健康状态统计 -->
      <el-row :gutter="20" class="health-stats">
        <el-col :xs="6" :sm="3">
          <div class="stat-item healthy">
            <div class="stat-number">{{ stats.healthy }}</div>
            <div class="stat-label">健康</div>
          </div>
        </el-col>
        <el-col :xs="6" :sm="3">
          <div class="stat-item sick">
            <div class="stat-number">{{ stats.sick }}</div>
            <div class="stat-label">生病</div>
          </div>
        </el-col>
        <el-col :xs="6" :sm="3">
          <div class="stat-item injured">
            <div class="stat-number">{{ stats.injured }}</div>
            <div class="stat-label">受伤</div>
          </div>
        </el-col>
        <el-col :xs="6" :sm="3">
          <div class="stat-item quarantine">
            <div class="stat-number">{{ stats.quarantine }}</div>
            <div class="stat-label">隔离</div>
          </div>
        </el-col>
      </el-row>
      
      <!-- 搜索栏 -->
      <div class="search-bar" style="margin-top: 20px;">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索动物名称或兽医"
          style="max-width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
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
        <el-table-column prop="animalName" label="动物名称" />
        <el-table-column prop="checkDate" label="检查日期" width="120" />
        <el-table-column prop="temperature" label="体温(°C)" width="100" />
        <el-table-column prop="weight" label="体重(kg)" width="100" />
        <el-table-column prop="symptoms" label="症状" show-overflow-tooltip />
        <el-table-column prop="diagnosis" label="诊断" show-overflow-tooltip />
        <el-table-column prop="veterinarian" label="兽医" width="100" />
        <el-table-column prop="nextCheckDate" label="下次复查" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
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
      :title="isEdit ? '编辑健康记录' : '添加健康记录'"
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
            <el-form-item label="检查日期" prop="checkDate">
              <el-date-picker
                v-model="formData.checkDate"
                type="date"
                placeholder="选择检查日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="体温(°C)" prop="temperature">
              <el-input-number v-model="formData.temperature" :min="30" :max="45" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重(kg)" prop="weight">
              <el-input-number v-model="formData.weight" :min="0" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="症状" prop="symptoms">
          <el-input
            v-model="formData.symptoms"
            type="textarea"
            :rows="2"
            placeholder="请描述症状"
          />
        </el-form-item>
        
        <el-form-item label="诊断" prop="diagnosis">
          <el-input
            v-model="formData.diagnosis"
            type="textarea"
            :rows="2"
            placeholder="请输入诊断结果"
          />
        </el-form-item>
        
        <el-form-item label="治疗方案" prop="treatment">
          <el-input
            v-model="formData.treatment"
            type="textarea"
            :rows="2"
            placeholder="请输入治疗方案"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="兽医" prop="veterinarian">
              <el-input v-model="formData.veterinarian" placeholder="请输入兽医姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次复查">
              <el-date-picker
                v-model="formData.nextCheckDate"
                type="date"
                placeholder="选择下次复查日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog v-model="detailVisible" title="健康记录详情" width="500px">
      <div v-if="currentRecord" class="detail-content">
        <p><strong>动物:</strong> {{ currentRecord.animalName }}</p>
        <p><strong>检查日期:</strong> {{ currentRecord.checkDate }}</p>
        <p><strong>体温:</strong> {{ currentRecord.temperature }}°C</p>
        <p><strong>体重:</strong> {{ currentRecord.weight }}kg</p>
        <p><strong>症状:</strong> {{ currentRecord.symptoms || '无' }}</p>
        <p><strong>诊断:</strong> {{ currentRecord.diagnosis || '无' }}</p>
        <p><strong>治疗方案:</strong> {{ currentRecord.treatment || '无' }}</p>
        <p><strong>兽医:</strong> {{ currentRecord.veterinarian }}</p>
        <p><strong>下次复查:</strong> {{ currentRecord.nextCheckDate || '无需复查' }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { HealthRecord, Animal } from '@/types'
import { healthApi } from '@/services/health'
import { animalApi } from '@/services/animal'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentRecord = ref<HealthRecord | null>(null)

const tableData = ref<HealthRecord[]>([])
const animals = ref<Animal[]>([])
const total = ref(0)

const searchKeyword = ref('')
const searchStatus = ref<string | ''>('')

const stats = ref({
  healthy: 142,
  sick: 8,
  injured: 4,
  quarantine: 2
})

const pageParams = reactive({
  page: 1,
  pageSize: 10
})

const formData = reactive<Partial<HealthRecord>>({
  animalId: undefined,
  animalName: '',
  checkDate: dayjs().format('YYYY-MM-DD'),
  temperature: 37.5,
  weight: 0,
  symptoms: '',
  diagnosis: '',
  treatment: '',
  veterinarian: '',
  nextCheckDate: ''
})

const formRules: FormRules = {
  animalId: [{ required: true, message: '请选择动物', trigger: 'change' }],
  checkDate: [{ required: true, message: '请选择检查日期', trigger: 'change' }],
  temperature: [{ required: true, message: '请输入体温', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  veterinarian: [{ required: true, message: '请输入兽医姓名', trigger: 'blur' }]
}

// 获取健康记录列表
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const response = await healthApi.getList({
    //   ...pageParams,
    //   keyword: searchKeyword.value
    // })
    // tableData.value = response.data.list
    // total.value = response.data.total
    
    // 模拟数据
    tableData.value = [
      { id: 1, animalId: 1, animalName: '大熊猫', checkDate: '2024-03-10', temperature: 36.5, weight: 120.5, symptoms: '', diagnosis: '健康', treatment: '', veterinarian: '李医生', nextCheckDate: '2024-03-17' },
      { id: 2, animalId: 3, animalName: '东北虎', checkDate: '2024-03-09', temperature: 38.2, weight: 180.0, symptoms: '食欲下降', diagnosis: '感冒', treatment: '服用感冒药', veterinarian: '王医生', nextCheckDate: '2024-03-12' },
      { id: 3, animalId: 2, animalName: '金丝猴', checkDate: '2024-03-08', temperature: 37.0, weight: 15.2, symptoms: '', diagnosis: '健康', treatment: '', veterinarian: '张医生', nextCheckDate: '2024-03-15' }
    ]
    total.value = 456
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

const openDialog = (row?: HealthRecord) => {
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
    checkDate: dayjs().format('YYYY-MM-DD'),
    temperature: 37.5,
    weight: 0,
    symptoms: '',
    diagnosis: '',
    treatment: '',
    veterinarian: '',
    nextCheckDate: ''
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
          // await healthApi.update(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          // await healthApi.create(formData as any)
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

const handleDelete = async (row: HealthRecord) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条健康记录吗？`,
      '确认删除',
      { type: 'warning' }
    )
    // await healthApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

const viewDetail = (row: HealthRecord) => {
  currentRecord.value = row
  detailVisible.value = true
}

onMounted(() => {
  fetchData()
  fetchAnimals()
})
</script>

<style scoped lang="scss">
.health-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .health-stats {
    margin-bottom: 20px;
    
    .stat-item {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      color: white;
      
      &.healthy {
        background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      }
      
      &.sick {
        background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
      }
      
      &.injured {
        background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
      }
      
      &.quarantine {
        background: linear-gradient(135deg, #909399 0%, #b1b3b8 100%);
      }
      
      .stat-number {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        opacity: 0.9;
      }
    }
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
  .health-page {
    .health-stats {
      .stat-item {
        .stat-number {
          font-size: 20px;
        }
        
        .stat-label {
          font-size: 12px;
        }
      }
    }
    
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
