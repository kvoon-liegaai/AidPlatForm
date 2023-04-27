<script setup lang='ts'>
import { Notify, useMeta } from 'quasar'
import { useRouteQuery } from '@vueuse/router'
import { fetchResourceListWithTag } from 'src/service/resource/resource.api'
import { status2Name } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { JsonViewer } from 'vue3-json-viewer'
import type { ExAddress } from 'src/service/map/map.model'
import { getIGeoByLnglat } from 'src/utils/map'
import { useProfileStore } from 'src/stores/profile.store'
import { useDefaultCoords } from 'src/composition/geo'
import GeoViewer from 'components/GeoViewer.vue'
import { ReturnCode } from 'src/common/ws'
import type { WsRes } from 'src/common/ws'
import { formatDate } from 'src/utils/date'
import { notificationSocket } from 'src/service/websocket/notification'

interface TagCardModel extends HelpResourceModel, ExAddress {
  expanded: boolean
}

const profileStore = useProfileStore()
const tag = useRouteQuery('tag', '')

useMeta({
  title: tag.value,
})

const tagList = ref<TagCardModel[]>([])
const mapViewerState = reactive({
  isShowMapViewer: false,
  location: useDefaultCoords('object'),
})

function showMapViewer(item: TagCardModel) {
  const { longitude, latitude } = item
  mapViewerState.isShowMapViewer = true
  mapViewerState.location.longitude = longitude
  mapViewerState.location.latitude = latitude
}

function onExpand(item: TagCardModel) {
  if (item.expanded) {
    getIGeoByLnglat(new AMap.LngLat(item.longitude, item.latitude))
      .subscribe((geo) => {
        item.address = geo.address
        item.fullAddress = geo.fullAddress
      })
  }
}

const tryRequestHelp = (item: TagCardModel) => {
  // if (Number(item.user?.id) === Number(profileStore.id)) {
  //   Notify.create({ position: 'center', message: '你不能对自己请求帮助' })
  //   return
  // }

  if (notificationSocket.disconnected) {
    Notify.create({
      type: 'negative',
      message: 'ws: 服务器连接异常',
    })
    console.error(notificationSocket)
    return
  }

  notificationSocket.emit(
    'apply-hr',
    { userId: profileStore.id, providerId: item.user.id, helpResourceId: item.id },
    (res: WsRes) => {
      console.log('res', res)
      switch (res.code) {
        case ReturnCode.fail:
          Notify.create({
            message: res.message,
          })
          break
        case ReturnCode.error:
          Notify.create({
            type: 'negative',
            message: res.message,
          })
          break
        case ReturnCode.success:
          Notify.create({
            type: 'position',
            message: res.message,
          })
          break
        default:
          console.log(res)
          break
      }
    })
}

onMounted(() => {
  fetchResourceListWithTag(tag.value)
    .subscribe((list: HelpResourceModel[]) => {
      tagList.value = list.map((item): TagCardModel => {
        return {
          ...item,
          expanded: false,
          fullAddress: '',
          address: '',
        }
      })
    })
})
</script>

<template>
  <JsonViewer :value="tagList" copyable sort theme="dark" />
  <div class="flex flex-col mt-4">
    <div class="font-bold text-lg">
      List
    </div>
    <div class="mt-4">
      <div>
        <q-card v-for="(item, index) in tagList" :key="index" class="bg-white rounded-lg shadow-md mb-4">
          <!-- header -->

          <q-card-section class="flex justify-between">
            <div class="text-gray-500">
              {{ formatDate(item.createTime) }}
            </div>
            <div>
              <!-- TODO: 补全颜色 -->
              <span v-if="item.status === 0" class="text-red-500">{{ status2Name[item.status] }}</span> <span v-else
                class="text-green-500">{{ status2Name[item.status] }}</span>
            </div>
          </q-card-section>

          <!-- center -->

          <q-expansion-item v-model="item.expanded" label="Account settings" caption="John Doe"
            @before-show="onExpand(item)">
            <template #header>
              <q-item-section avatar>
                <q-avatar rounded>
                  <img src="https://picsum.photos/500/300">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <div class="font-bold">
                  {{ item.name }}
                </div>
                <div class="text-gray-500">
                  {{ `${(item.start_date)}-${(item.end_date)}` }}
                </div>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center">
                  <q-icon name="star" color="red" size="24px" />
                  <q-icon name="star" color="red" size="24px" />
                  <q-icon name="star" color="red" size="24px" />
                </div>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <div class="text-lg text-primary">
                  描述
                </div>
                <div break-all>
                  {{ item.describe }}
                </div>
              </q-card-section>
              <q-card-section v-if="item.address || item.fullAddress">
                <div class="text-lg text-primary" flex items-center>
                  地理位置
                </div>
                <div class="text-md" leading-loose>
                  {{ item.address }}
                </div>
                <div class="text-coolgray-400" break-all>
                  {{ item.fullAddress }}
                </div>
              </q-card-section>
              <q-card-section v-else>
                <q-skeleton type="text" class="text-subtitle1" />
                <q-skeleton type="text" width="50%" class="text-subtitle1" />
                <q-skeleton type="text" class="text-caption" />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- action -->

          <q-card-actions>
            <div>
              <q-btn-group :rounded="true" border="1 coolgray-300 solid" flat w-full>
                <q-btn flat color="primary" label="联系一下" icon="chat" />
                <q-btn flat color="info" label="查看位置" icon="map" @click="showMapViewer(item)" />
                <q-btn flat color="pink" label="请求帮助" icon="handshake" @click="tryRequestHelp(item)" />
              </q-btn-group>
            </div>
            <q-space />
          </q-card-actions>

          <!-- bottom -->

          <q-card-section class="flex items-center justify-between pt-0">
            <div class="text-gray-500">
              {{ item.tag }}
            </div>
            <div>
              <q-chip v-if="item.receiver">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg">
                </q-avatar>
                {{ item.receiver?.username }}
              </q-chip>
              <q-chip>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/avatar5.jpg">
                </q-avatar>
                {{ item.user?.username }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <q-dialog v-model="mapViewerState.isShowMapViewer">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>地理位置</q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <GeoViewer :source="mapViewerState.location" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang='scss' scoped></style>
