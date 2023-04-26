<script setup lang='ts'>
import { useDefaultCoords } from 'src/composition/geo'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { notificationSocket } from 'src/service/websocket/notification'
import GeoNav from 'src/components/GeoNav.vue'
import type { MapNavState } from '../types'

const props = defineProps<{
  hr: HelpResourceModel
}>()

const progress = ref(0.1)
const progressLabel = computed(() => {
  return `${progress}`
})

const mapNavState = reactive<MapNavState>({
  isShowMapNav: false,
  source: useDefaultCoords('object'),
})

function setHrStatus(status: HelpResourceStatus) {
  // TODO: start
  console.log('start')
  notificationSocket.emit('update-hr', {
    helpResourceId: props.hr.id,
    status,
  })
}

function showMapNav(hr: HelpResourceModel) {
  // isshow
  mapNavState.isShowMapNav = true
  // source
  mapNavState.source.longitude = hr.longitude
  mapNavState.source.latitude = hr.latitude
}
</script>

<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-card-section>
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" width="80px" height="100%">
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
          <div class="time" color-coolGray>
            <q-icon name="schedule" />
            {{ hr.start_date }}
          </div>
        </div>
        <div flex justify-between>
          <q-avatar size="30px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <q-btn icon="near_me" btn-gray label="去这里" flat />
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
    <q-card-actions v-if="hr.status === HelpResourceStatus.PENDING">
      <q-btn grow-1 label="取消" flat btn-gray />
      <q-btn grow-1 label="开始" flat bg="primary" text-color="white" @click="showMapNav(hr)" />
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
          <GeoNav :state="mapNavState" @set-hr-status="setHrStatus" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang='scss' scoped></style>
