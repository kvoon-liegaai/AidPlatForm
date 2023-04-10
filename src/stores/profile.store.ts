import { defineStore } from 'pinia'
import { AuthService } from 'src/service/auth/auth.service'
import { getSelfProfile } from 'src/service/user/user.api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    id: 0,
    username: '',
  })

  const updateProfile = () => {
    getSelfProfile().subscribe((p) => {
      profile.value = p
    })
  }

  const resetProfile = () => {
    profile.value = {
      id: 0,
      username: '',
    }
  }

  watch(AuthService.getInstance().access_token, (value) => {
    if (value)
      updateProfile()
    else
      resetProfile()
  }, { immediate: true })

  const getId = (): number => profile.value.id
  const getUsername = (): string => profile.value.username

  return {
    getId,
    getUsername,
  }
})
