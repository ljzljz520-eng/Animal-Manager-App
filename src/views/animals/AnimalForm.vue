<template>
  <div class="animal-form">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑动物' : '添加动物' }}</span>
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
            <el-form-item label="动物名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入动物名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
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

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="物种" prop="species">
              <el-input v-model="form.species" placeholder="请输入物种名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="form.age"
                :min="0"
                :max="100"
                placeholder="请输入年龄"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio value="male">公</el-radio>
                <el-radio value="female">母</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="体重(kg)" prop="weight">
              <el-input-number
                v-model="form.weight"
                :min="0"
                :max="10000"
                :step="0.1"
                placeholder="请输入体重"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="健康状态" prop="healthStatus">
              <el-select v-model="form.healthStatus" placeholder="请选择健康状态" style="width: 100%">
                <el-option label="健康" value="healthy" />
                <el-option label="生病" value="sick" />
                <el-option label="受伤" value="injured" />
                <el-option label="隔离" value="quarantine" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="头像">
              <el-upload
                v-model:file-list="fileList"
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <el-avatar v-if="form.avatar" :size="80" :src="form.avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '添加动物' }}
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
import { createAnimal, updateAnimal, getAnimal, type CreateAnimalData } from '../../api/animals'
import { getAllCategories, type Category } from '../../api/categories'

const router = useRouter()
const route = useRoute()

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const categories = ref<Category[]>([])
const fileList = ref<any[]>([])

const isEdit = ref(!!route.params.id)

const form = reactive<CreateAnimalData>({
  name: '',
  categoryId: 0,
  species: '',
  age: 0,
  gender: 'male',
  weight: 0,
  healthStatus: 'healthy',
  description: '',
  avatar: ''
})

const rules = {
  name: [
    { required: true, message: '请输入动物名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在2到50个字符之间', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  species: [
    { required: true, message: '请输入物种名称', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  weight: [
    { required: true, message: '请输入体重', trigger: 'blur' }
  ],
  healthStatus: [
    { required: true, message: '请选择健康状态', trigger: 'change' }
  ]
}

const loadCategories = async () => {
  try {
    const response = await getAllCategories()
    categories.value = response.data
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

const loadAnimal = async (id: number) => {
  try {
    const response = await getAnimal(id)
    const data = response.data
    Object.assign(form, {
      name: data.name,
      categoryId: data.categoryId,
      species: data.species,
      age: data.age,
      gender: data.gender,
      weight: data.weight,
      healthStatus: data.healthStatus,
      description: data.description,
      avatar: data.avatar
    })
  } catch (error) {
    ElMessage.error('加载动物信息失败')
    router.push('/animals')
  }
}

const handleUploadSuccess = (response: any) => {
  form.avatar = response.data.url
  ElMessage.success('上传成功')
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
  }
  return isImage && isLt2M
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await updateAnimal(Number(route.params.id), form)
      ElMessage.success('修改成功')
    } else {
      await createAnimal(form)
      ElMessage.success('添加成功')
    }

    router.push('/animals')
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
  router.push('/animals')
}

onMounted(() => {
  loadCategories()
  if (isEdit.value) {
    loadAnimal(Number(route.params.id))
  }
})
</script>

<style scoped>
.animal-form {
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

.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .form-content {
    max-width: 100%;
  }
}
</style>
