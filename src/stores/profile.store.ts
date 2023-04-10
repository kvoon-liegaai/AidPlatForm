import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', () => {
  const id = ref()

  const updateId = (userId: number) => {
    id.value = userId
  }

  return {
    id,
    updateId,
  }
})
