<script setup lang='ts'>
import { useDefaultCoords } from 'src/composition/geo'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import GeoNav from 'src/components/GeoNav.vue'
import type { MapNavState } from '../types'
import { setHrStatus } from '../utils'

const props = defineProps<{
  hr: HelpResourceModel
  isProvider: boolean
}>()

const router = useRouter()

const mapNavState = reactive<MapNavState>({
  isShowMapNav: false,
  source: useDefaultCoords('object'),
  isStarter: false,
})

function showMapNav(hr: HelpResourceModel, isStarter: boolean) {
  // isshow
  mapNavState.isShowMapNav = true
  // source
  mapNavState.source.longitude = hr.longitude
  mapNavState.source.latitude = hr.latitude
  mapNavState.isStarter = isStarter
}

function onStart() {
  setHrStatus(props.hr, HelpResourceStatus.ONGOING)
}

function onCancel() {
  setHrStatus(props.hr, HelpResourceStatus.CANCELED)
}
</script>

<template>
  <q-card class="my-card">
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
          <div class="time" color-coolGray>
            <q-icon name="schedule" />
            {{ hr.start_date }}
          </div>
        </div>
        <div flex justify-between>
          <q-chip clickable text-color="primary"
            @click="() => hr.receiver ? router.push(`/chat/${hr.receiver.id}`) : void 0">
            <q-avatar>
              <img src=" https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            联系一下
          </q-chip>
          <q-chip clickable bg-cool-gray-200 text-color="primary" icon="near_me" @click="showMapNav(hr, false)">
            查看位置
          </q-chip>
        </div>
      </q-card-section>
    </q-card-section>

    <hr class="q-separator q-separator--horizontal" aria-orientation="horizontal">
    <q-card-actions>
      <q-btn grow-1 label="取消" flat btn-gray @click="onCancel" />
      <q-btn v-if="props.isProvider" grow-1 label="开始" flat bg="primary" text-color="white"
        @click="showMapNav(hr, true)" />
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
          <GeoNav :state="mapNavState" :starter="true" @on-start="onStart" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang='scss' scoped></style>
