import axios from 'axios'
import { useTokenStore } from '@/stores/token.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const store = useTokenStore()
  if (!config.headers) {
    config.headers = {}
  }
  config.headers.Authorization = store.token?.token

  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status !== 200) {
      ElMessage.error(error.response.data.msg)
      await router.push({ name: 'login' })
      return
    }
    return Promise.reject(error)
  }
)

export default request
