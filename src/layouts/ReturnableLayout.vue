<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

const title = useTitle('', { observe: true })

function onBack() {
  router.back()
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-white color-gray-8">
        <q-btn flat round dense @click="onBack">
          <q-icon name="chevron_left" />
        </q-btn>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <!-- <q-btn flat round dense>
              <q-icon name="more_vert" />
            </q-btn> -->
      </q-toolbar>
    </q-header>

    <q-page-container h-screen bg-gray-100>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
