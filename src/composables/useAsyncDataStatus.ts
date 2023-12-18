import { ref } from 'vue'

export default function useAsyncDataStatus() {
  const ready = ref(false)

  const fetched = () => {
    ready.value = true
  }

  return { ready, fetched }
}
