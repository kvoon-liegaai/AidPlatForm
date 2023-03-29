<script setup lang='ts'>
const props = defineProps<{
  title: string
}>()
const router = useRouter()

function onBack() {
  router.back()
}
</script>

<template>
  <q-toolbar class="text-primary bg-white">
    <q-btn flat round dense icon="arrow_back_ios_new" @click="onBack" />
    <q-toolbar-title>
      {{ props.title }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<style lang='scss' scoped></style>
