<script setup lang='ts'>
import { useDefaultCoords } from 'src/composition/geo'
import { getProviderAppointList } from 'src/service/resource/resource.api'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import GeoNav from 'components/GeoNav.vue'
import { notificationSocket } from 'src/service/websocket/notification'
import type { MapNavState } from './types'

const curTab = ref<HelpResourceStatus>(HelpResourceStatus.UNUSED)

const hrList = ref<HelpResourceModel[]>([])

const mapNavState = reactive<MapNavState>({
  isShowMapNav: false,
  source: useDefaultCoords('object'),
  curHr: hrList.value[0] ? hrList.value[0] : null,
})

watch(curTab, (tab) => {
  getProviderAppointList(tab)
    .subscribe((list) => {
      return hrList.value = list
    })
})

function setHrStatus(status: HelpResourceStatus) {
  // TODO: start
  console.log('start')
  console.log('mapNavState.curHr', mapNavState.curHr)
  if (!mapNavState.curHr) {
    console.error('not find mapNavState.cur', mapNavState)
    return
  }
  notificationSocket.emit('update-hr', {
    helpResourceId: mapNavState.curHr.id,
    status,
  })
}

function showMapNav(hr: HelpResourceModel) {
  // isshow
  mapNavState.isShowMapNav = true
  // source
  mapNavState.source.longitude = hr.longitude
  mapNavState.source.latitude = hr.latitude
  // hr
  mapNavState.curHr = hr
}

onMounted(() => {
  getProviderAppointList()
    .subscribe((list) => {
      hrList.value = list
    })
})
</script>

<template>
  <div class="q-gutter-y-md">
    <q-tabs v-model="curTab" outside-arrows mobile-arrows narrow-indicator dense align="justify"
      class="text-orange bg-coolGray-1 rounded-4">
      <q-tab v-for="(tabName, status) in status2Name" :key="status" :name="Number(status)"
        :label="Number(status) === HelpResourceStatus.UNUSED ? '全部' : tabName" :ripple="false" />
      <!-- <q-tab :ripple="false" name="all" label="全部" />
                              <q-tab :ripple="false" name="processing" label="进行中" />
                              <q-tab :ripple="false" name="fulfilled" label="已完成" />
                                <q-tab :ripple="false" name="canceled" label="已取消" />
                                                          <q-tab :ripple="false" name="pending" label="未开始" /> -->
    </q-tabs>
    <JsonViewer :value="hrList" copyable sort theme="dark" />
    <section class="card-list px-4 relative">
      <q-card v-for="(hr, key) in hrList" :key="key" class="my-card">
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
        <q-card-actions>
          <q-btn grow-1 label="取消" flat btn-gray />
          <q-btn grow-1 label="开始" flat bg="primary" text-color="white" @click="showMapNav(hr)" />
        </q-card-actions>
      </q-card>
    </section>
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
  </div>
</template>

<style lang='scss' scoped>
.overlapping {
  border: 2px solid white;
  position: absolute;
}
</style>
