import api from '@/lib/axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const toast = useToast()

  const handleRequest = async (method, url, data = null, notify = true) => {
    loading.value = true
    error.value = null
    try {
      const config = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (method.toLowerCase() === 'get' && data) {
        config.params = data
      } else {
        config.data = data
      }

      const response = await api(config)

      if (notify) {
        toast.success('تمت العملية بنجاح ✅')
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'حدث خطأ ما'

      if (notify) {
        toast.error(`خطأ: ${error.value}`)
      }

      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { handleRequest, loading, error }
}
