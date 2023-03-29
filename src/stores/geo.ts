import { defineStore } from 'pinia'
import { useGeolocation } from '@vueuse/core'

export const useGeoStore = defineStore('geo', () => {
  const geoLoc = useGeolocation({
    immediate: true,
  })
  return geoLoc
})
