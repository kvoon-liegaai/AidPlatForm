<script setup lang="ts">
// import { authService } from './service/auth'
import { useRouter } from 'vue-router'
import { AuthService } from './service/auth'
import { useGeoStore } from './stores/geo'

const router = useRouter()
useGeoStore()

const authService = AuthService.getInstance()

authService.isLoggedIn().subscribe((val) => {
  if (!val) {
    console.log('router', router)
    router.replace('/auth/login')
  }
})
</script>

<template>
  <router-view />
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
