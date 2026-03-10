<template>
  <div class="feeding-form">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑饲养记录' : '添加饲养记录' }}</span>
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
            <el-form-item label="食物类型" prop="foodType">
              <el-input v-model="form.foodType" placeholder="请输入食物类型" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="数量(kg)" prop="quantity">
              <el-input-number
                v-model="form.quantity"
                :min="0"
                :max="1000"
                :step="0.1"
                placeholder="请输入数量"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="喂食时间" prop="feedingTime">
              <el-date-picker
                v-model="form.feedingTime"
                type="datetime"
                placeholder="选择喂食时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="喂食人" prop="feeder">
              <el-input v-model="form.feeder" placeholder="请输入喂食人姓名" />
            </el-form-item>
          </el-col>
        </el-row>

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
  createFeedingRecord,
  updateFeedingRecord,
  getFeedingRecord,
  type CreateFeedingRecordData
} from '../../api/feeding'
import { getAnimals, type Animal } from '../../api/animals'

const router = useRouter()
const route = useRoute()

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const animals = ref<Animal[]>([])

const isEdit = ref(!!route.params.id)

const form = reactive<CreateFeedingRecordData>({
  animalId: 0,
  foodType: '',
  quantity: 0,
  feedingTime: new Date().toISOString(),
  feeder: '',
  notes: ''
})

const rules = {
  animalId: [
    { required: true, message: '请选择动物', trigger: 'change' }
  ],
  foodType: [
    { required: true, message: '请输入食物类型', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ],
  feedingTime: [
    { required: true, message: '请选择喂食时间', trigger: 'change' }
  ],
  feeder: [
    { required: true, message: '请输入喂食人姓名', trigger: 'blur' }
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

const loadFeedingRecord = async (id: number) => {
  try {
    const response = await getFeedingRecord(id)
    const data = response.data
    Object.assign(form, {
      animalId: data.animalId,
      foodType: data.foodType,
      quantity: data.quantity,
      feedingTime: data.feedingTime,
      feeder: data.feeder,
      notes: data.notes
    })
  } catch (error) {
    ElMessage.error('加载饲养记录失败')
    router.push('/feeding')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await updateFeedingRecord(route.params.id as number, form)
      ElMessage.success('修改成功')
    } else {
      await createFeedingRecord(form)
      ElMessage.success('添加成功')
    }

    router.push('/feeding')
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
  router.push('/feeding')
}

onMounted(() => {
  loadAnimals()
  if (isEdit.value) {
    loadFeedingRecord(route.params.id as number)
  }
})
</script>

<style scoped>
.feeding-form {
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
