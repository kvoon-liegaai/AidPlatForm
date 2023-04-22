<script setup lang='ts'>
import { useQuasar } from 'quasar'
import SubArea from './components/SubArea.vue'
import { subAreas } from './model'
const router = useRouter()

const shortcuts = [
  {
    title: '咨询社区',
    imgSrc: '/src/assets/img/callcomu.jpg',
    bg: 'bg-gradient-to-r from-green-400 to-blue-500',
    btn: {
      label: '立即咨询',
      bg: 'primary',
      icon: '',
      onClick: () => console.log('立即咨询'),
    },
  },
  {
    title: '快速匹配',
    imgSrc: '/src/assets/img/quick_match.jpg',
    bg: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
    btn: {
      label: '快速匹配',
      bg: 'red',
      icon: '',
      onClick: quickMatch,
    },
  },
]

// TODO:
// function checkMatchSheet() {}

const { dialog } = useQuasar()

function quickMatch() {
  dialog({
    title: '快速匹配',
    message: '需要设置一份表单用于匹配',
    ok: {
      push: true,
    },
    cancel: {
      push: true,
      color: 'negative',
    },
  })
    .onOk(() => {
      console.log('ok')
      router.push('/setting/quick-match')
    })
    .onCancel(() => {
      console.log('cancel')
    })
}
</script>

<template>
  <!-- <q-toolbar class=" bg-white">
            <q-toolbar-title>
              服务列表
            </q-toolbar-title>
            <q-btn flat round dense icon="more_vert" />
          </q-toolbar> -->
  <!-- <q-bar dark class="bg-primary text-white"> -->
  <q-page padding class="homepage">
    <div v-for="(shortcut, key) in shortcuts" :key="key" class="shortcut shadow-md" grid grid-cols-4 mb-4 rounded-2
      overflow-hidden h-20>
      <div class="shortcut__img" col-span-1>
        <q-img :src="shortcut.imgSrc" :ratio="3 / 4" h-20 />
      </div>
      <div class="shortcut__panel" :class="shortcut.bg" col-span-3 flex justify-between px-2 items-center>
        <div class="shortcut__panel__title text-white font-bold text-xl">
          <!-- <div class="shortcut__panel__title text-[#00454FFF] font-bold text-xl"> -->
          {{ shortcut.title }}
        </div>
        <div class="shortcut__panel__btn">
          <q-btn :color="shortcut.btn.bg" :label="shortcut.btn.label" @click="shortcut.btn.onClick" />
        </div>
      </div>
    </div>
    <SubArea v-for="(subArea, key) in subAreas" :key="key" :sub-area="subArea" />
  </q-page>
</template>

<style lang='scss' scoped></style>
