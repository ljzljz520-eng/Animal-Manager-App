<template>
  <div class="health-form">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑健康记录' : '添加健康记录' }}</span>
          <el-button @click="handleBack">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="form-content"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="选择动物" prop="animalId">
              <el-select v-model="form.animalId" placeholder="请选择动物" style="width: 100%">
                <el-option
                  v-for="animal in animals"
                  :key="animal.id"
                  :label="animal.name"
                  :value="animal.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="检查类型" prop="checkType">
              <el-select v-model="form.checkType" placeholder="请选择检查类型" style="width: 100%">
                <el-option label="常规检查" value="常规检查" />
                <el-option label="疫苗接种" value="疫苗接种" />
                <el-option label="疾病治疗" value="疾病治疗" />
                <el-option label="体检" value="体检" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="检查日期" prop="checkDate">
              <el-date-picker
                v-model="form.checkDate"
                type="date"
                placeholder="选择检查日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="兽医" prop="veterinarian">
              <el-input v-model="form.veterinarian" placeholder="请输入兽医姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="检查结果" prop="result">
          <el-input
            v-model="form.result"
            type="textarea"
            :rows="3"
            placeholder="请输入检查结果"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '添加记录' }}
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'
import {
  createHealthRecord,
  updateHealthRecord,
  getHealthRecord,
  type CreateHealthRecordData
} from '../../api/health'
import { getAnimals, type Animal } from '../../api/animals'

const router = useRouter()
const route = useRoute()

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const animals = ref<Animal[]>([])

const isEdit = ref(!!route.params.id)

const form = reactive<CreateHealthRecordData>({
  animalId: 0,
  checkType: '',
  checkDate: new Date().toISOString().split('T')[0],
  result: '',
  veterinarian: '',
  notes: ''
})

const rules = {
  animalId: [
    { required: true, message: '请选择动物', trigger: 'change' }
  ],
  checkType: [
    { required: true, message: '请选择检查类型', trigger: 'change' }
  ],
  checkDate: [
    { required: true, message: '请选择检查日期', trigger: 'change' }
  ],
  result: [
    { required: true, message: '请输入检查结果', trigger: 'blur' }
  ],
  veterinarian: [
    { required: true, message: '请输入兽医姓名', trigger: 'blur' }
  ]
}

const loadAnimals = async () => {
  try {
    const response = await getAnimals({ page: 1, pageSize: 1000 })
    animals.value = response.data.list
  } catch (error) {
    console.error('加载动物列表失败:', error)
  }
}

const loadHealthRecord = async (id: number) => {
  try {
    const response = await getHealthRecord(id)
    const data = response.data
    Object.assign(form, {
      animalId: data.animalId,
      checkType: data.checkType,
      checkDate: data.checkDate,
      result: data.result,
      veterinarian: data.veterinarian,
      notes: data.notes
    })
  } catch (error) {
    ElMessage.error('加载健康记录失败')
    router.push('/health')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await updateHealthRecord(route.params.id as number, form)
      ElMessage.success('修改成功')
    } else {
      await createHealthRecord(form)
      ElMessage.success('添加成功')
    }

    router.push('/health')
  } catch (error: any) {
    if (error.response) {
      ElMessage.error(error.response.data.message || '操作失败')
    }
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}

const handleBack = () => {
  router.push('/health')
}

onMounted(() => {
  loadAnimals()
  if (isEdit.value) {
    loadHealthRecord(route.params.id as number)
  }
})
</script>

<style scoped>
.health-form {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-content {
  max-width: 800px;
}

@media (max-width: 768px) {
  .form-content {
    max-width: 100%;
  }
}
</style>
