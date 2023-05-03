import { defineStore } from 'pinia'
import { AuthService } from 'src/service/auth/auth.service'
import { getProfileById, getSelfProfile } from 'src/service/user/user.api'

export const useProfileStore = defineStore('profile', () => {
  const id = ref(0)
  const username = ref('')
  const nickname = ref('')

  const updateProfile = () => {
    getSelfProfile().subscribe((p) => {
      id.value = p.id
      username.value = p.username
      getProfileById(p.id).subscribe((profile) => {
        nickname.value = profile.nickname
      })
    })
  }

  const resetProfile = () => {
    id.value = 0
    username.value = ''
  }

  watch(AuthService.getInstance().access_token, (value) => {
    if (value)
      updateProfile()
    else
      resetProfile()
  }, { immediate: true })

  return {
    id,
    username,
    nickname,
  }
})
