<script setup lang='ts'>
import { useMeta } from 'quasar'
import { useRouteQuery } from '@vueuse/router'
import { fetchResourceListWithTag } from 'src/service/resource/resource.api'
import type { HelpResourceModel } from 'src/service/resource/resource.model'

const tag = useRouteQuery('tag', '')

useMeta({
  title: tag.value,
})

const tagList = ref<HelpResourceModel[] | never[]>([])

onMounted(() => {
  fetchResourceListWithTag(tag.value)
    .subscribe((list) => {
      tagList.value = list
    })
})
</script>

<template>
  <div v-for="(item, key) in tagList" :key="key">
    {{ JSON.stringify(item) }}
  </div>
</template>

<style lang='scss' scoped></style>
