<script setup lang='ts'>
const props = defineProps<{
  username: string
  helpResourceName: string
}>()
</script>

<template>
  <div>
    用户名：{{ props.username }}
    资源名称: {{ props.helpResourceName }}
  </div>
</template>

<style lang='scss' scoped></style>
