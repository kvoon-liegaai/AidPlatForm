<script setup lang='ts'>
import { useDefaultCoords } from 'src/composition/geo'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import GeoNav from 'src/components/GeoNav.vue'
import { Notify, date } from 'quasar'
import { useTimestamp } from '@vueuse/core'
import { callPolice } from 'src/utils/tel'
import type { MapNavState } from '../types'
import { setHrStatus, timestamp2MS } from '../utils'

const props = defineProps<{
  hr: HelpResourceModel
  isProvider: boolean
}>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

const router = useRouter()

const curTimeStamp = useTimestamp({ offset: 0 })

const progress = computed(() => {
  if (!props.hr.record)
    return 0
  console.log('props.hr.record.start_date', typeof props.hr.record.start_date)
  const end_date = Date.parse(date.extractDate(props.hr.end_date, 'YYYY-MM-DD HH:mm').toDateString())
  const start_date = Date.parse(props.hr.record.start_date)
  const now_date = Date.now()
  console.log('end_date', end_date)
  console.log('start_date', start_date)
  const res = (now_date - start_date) / (end_date - start_date)
  return res < 0 ? 1 : res
})

const progressLabel = computed(() => {
  let timestamp = 0
  if (props.hr.record)
    timestamp = curTimeStamp.value - Date.parse(props.hr.record.start_date)

  const { minutes, seconds } = timestamp2MS(timestamp)

  return `已累计进行${minutes}分钟${seconds}秒`
})

const mapNavState = reactive<MapNavState>({
  isShowMapNav: false,
  source: useDefaultCoords('object'),
})

function showMapNav(hr: HelpResourceModel) {
  // isshow
  mapNavState.isShowMapNav = true
  // source
  mapNavState.source.longitude = hr.longitude
  mapNavState.source.latitude = hr.latitude
}

function onFinish() {
  console.log('onfinish', props.hr)
  setHrStatus(props.hr, HelpResourceStatus.FULFILL)
  Notify.create({ message: '操作成功' })
  nextTick(() => {
    emits('refresh')
  })
}

function onCancel() {
  setHrStatus(props.hr, HelpResourceStatus.CANCELED)
  Notify.create({ message: '取消成功' })
  nextTick(() => {
    emits('refresh')
  })
}
</script>

<template>
  <q-card class="my-card">
    <q-card-section py-0>
      <div class="time" color-coolGray flex justify-between leading-loose>
        <span>
          <q-icon name="schedule" />
          {{ hr.start_date }}
        </span>
        <span>
          <q-icon name="schedule" />
          {{ hr.end_date }}
        </span>
      </div>
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section>
        <q-img class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" width="80px" height="100%">
          <div class="absolute-bottom text-center top-0 b-0" flex flex-col justify-center font-bold align-middle>
            <div>
              {{ Number(hr.start_date.split(' ')[0].split('-')[1]) }} 月
            </div>
            <div text-lg>
              {{ Number(hr.start_date.split(' ')[0].split('-')[2]) }}
            </div>
          </div>
        </q-img>
      </q-card-section>
      <q-card-section grow-1 flex flex-col gap-5>
        <div>
          <div flex justify-between text-lg>
            <span font-bold>
              {{ hr.name }}
            </span>
            <span>
              <q-badge outline color="primary" :label="status2Name[hr.status]" />
            </span>
          </div>
        </div>
        <div flex gap-2>
          <!-- <q-avatar size="30px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <q-btn icon="chat" btn-gray label="联系一下" flat dense /> -->
          <q-chip clickable text-color="primary"
            @click="() => hr.receiver ? router.push(`/chat/${hr.receiver.id}`) : router.push(`/chat/${hr.user.id}`)">
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            联系一下
          </q-chip>
          <q-chip clickable bg-cool-gray-200 text-color="primary" icon="near_me" btn-gray flat @click="showMapNav(hr)">
            查看位置
          </q-chip>
          <!-- <q-btn icon =" /> -->
          <!-- <q-chip square color="primary" text-color="white" icon="event">
                                                                                                                              </q-chip> -->
        </div>
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-linear-progress size="25px" :value="progress" color="accent">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="progressLabel" />
        </div>
      </q-linear-progress>
    </q-card-section>

    <hr class="q-separator q-separator--horizontal" aria-orientation="horizontal">
    <q-card-actions>
      <!-- <q-btn grow-1 label="取消" flat btn-gray /> -->
      <q-btn v-if="!props.isProvider" color="blue" icon="local_police" label="报警" @click="callPolice" />
      <q-btn grow-1 label="取消" color="red" @click="onCancel" />
      <q-btn grow-1 label="完成" flat bg="primary" text-color="white" @click="onFinish" />
    </q-card-actions>
  </q-card>

  <q-dialog v-model="mapNavState.isShowMapNav">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>地理位置</q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <GeoNav :state="mapNavState" :start="false" :starter="false" @set-hr-status="setHrStatus" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang='scss' scoped></style>
