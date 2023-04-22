<script setup lang='ts'>
import { Icon } from '@iconify/vue'
import type { ISubArea } from '../model'

const props = defineProps<{
  subArea: ISubArea
}>()

const router = useRouter()

function toTag(tag: string) {
  console.log('tag', tag)
  router.push(`/home/tag-list?tag=${tag}`)
}
</script>

<template>
  <section class="subarea">
    <div my-5>
      <div class="title" text-xl font-bold>
        {{ props.subArea.name }}
      </div>
      <div class="subtitle text-(sm coolGray)" leading-loose>
        {{ props.subArea.subtitle }}
      </div>
    </div>
    <div v-for="(cardItem, key) in props.subArea.tags" :key="key" class="card " grid grid-cols-4 h-20 rounded-2
      bg-gradient-to-r from-white to-gray-100 overflow-hidden mb-4 @click="toTag(cardItem.tag)">
      <div class="card__icon-box" col-span-1 flex justify-center items-center bg-gradient-to-l from-white
        :style="`background-color:${cardItem.icon.background}`">
        <Icon :icon="cardItem.icon.name" :color="cardItem.icon.color" width="50" height="50" />
      </div>
      <div class="card__info" col-span-3 p-2>
        <div class="card__info__title" text-black font-bold>
          {{ cardItem.tag }}
        </div>
        <div class="card__info__desc" text-coolGray-400>
          {{ cardItem.desc }}
        </div>
      </div>
    </div>
  </section>
</template>

<style lang='scss' scoped>
.card {}
</style>
