<template>
  <section class="subarea">
    <div class="title" text-xl font-bold>{{ props.subArea.name }}</div>
    <div class="subtitle text-(sm coolGray)" leading-loose>{{ props.subArea.subtitle }}</div>
    <div class="card " grid grid-cols-4 h-20 rounded-2 overflow-hidden mb-4 v-for="(cardItem, key) in props.subArea.cards"
      :key="key">
      <div class="card__icon-box" col-span-1 flex justify-center items-center
        :style="'background-color:' + cardItem.icon.background">
        <Icon :icon="cardItem.icon.name" :color="cardItem.icon.color" width="50" height="50" />
      </div>
      <div class="card__info" col-span-3 p-2>
        <div class="card__info__title" text-black font-bold>{{ cardItem.title }}</div>
        <div class="card__info__desc" text-coolGray>{{ cardItem.desc }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { Icon } from '@iconify/vue'
import { ISubArea } from '../model';

const props = defineProps<{
  subArea: ISubArea
}>()
</script>

<style lang='scss' scoped></style>
