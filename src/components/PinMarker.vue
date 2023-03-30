<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { LoadStatus } from 'src/types/status'

const props = defineProps<{
  location: string
  themeColor: keyof typeof theme2StyleClass
  status: LoadStatus
  onClick?: () => unknown
}>()

const theme2StyleClass = {
  primary: 'pin-marker_theme-primary',
  orange: 'pin-marker_theme-orange',
}
</script>

<template>
  <section id="pin-marker" :class="theme2StyleClass[props.themeColor]" @click="onClick">
    <div class="pin-marker__board" :class="props.status !== LoadStatus.PREPARED ? 'pin-marker__board_unprepared' : ''">
      <!-- 用于 grid 布局占位未来可能展示图片 -->
      <div />
      <div v-show="props.status === LoadStatus.PREPARED" class="pin-marker__board__text">
        {{ location }}
      </div>
      <Icon v-show="props.status === LoadStatus.PREPARED && props.onClick" icon="ic:round-keyboard-arrow-right"
        color="#fcfcfc" width="20" />
      <div v-show="props.status === LoadStatus.PENDING" class="pin-marker__board__pending-dot" />
      <div v-show="props.status === LoadStatus.LOADING" class="pin-marker__board__loading-wave">
        <Icon icon="eos-icons:three-dots-loading" color="#fcfcfc" width="30" height="30" />
      </div>
    </div>
    <div class="pin-marker__needle" />
    <!-- <button @click="onClick">click</button> -->
  </section>
</template>

<style lang='scss' scoped>
.pin-marker_theme-primary {
  --pin-theme-color: #00bdd6;
}

.pin-marker_theme-orange {
  --pin-theme-color: #fea900;
}

.pin-marker__board {
  position: relative;
  display: grid;
  max-width: 300px;
  grid-template-columns: 20px auto 20px;
  column-gap: 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 40px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: #fcfcfc;
  background: var(--pin-theme-color);
  padding: 8px 0px;

  box-shadow: 4px 4px 8px #aaa;
}

.pin-marker__board_unprepared {
  width: 30px;
  height: 30px;
  padding: 0px;
  overflow: hidden;
  border-radius: 50%;
}

.pin-marker__board__pending-dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 10px;
}

.pin-marker__board__text {
  word-wrap: break-word;
}

.pin-marker__needle {
  background: var(--pin-theme-color);
  width: 2px;
  height: 20px;
  margin: 0 auto;

  box-shadow: 4px 4px 8px #aaa;
}
</style>
