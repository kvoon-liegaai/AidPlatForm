<script setup lang='ts'>
import { useMeta } from 'quasar'
import { useRouteQuery } from '@vueuse/router'
import { fetchResourceListWithTag } from 'src/service/resource/resource.api'
import { status2Name } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { JsonViewer } from 'vue3-json-viewer'
import type { ExAddress } from 'src/service/map/map.model'
import { getIGeoByLnglat } from 'src/utils/map'

interface TagCardModel extends HelpResourceModel, ExAddress {
  expanded: boolean
}

const tag = useRouteQuery('tag', '')

useMeta({
  title: '',
  // title: tag.value,
})

const tagList = ref<TagCardModel[]>([])

// const expanded = ref(false)
// const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (`0${date.getMonth()}1`).slice(-2)
  const day = (`0${date.getDate()}`).slice(-2)
  return `${year}-${month}-${day}`
}

const onExpand = (item: TagCardModel) => {
  if (item.expanded) {
    getIGeoByLnglat(new AMap.LngLat(item.longitude, item.latitude))
      .subscribe((geo) => {
        item.address = geo.address
        item.fullAddress = geo.fullAddress
      })
  }
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
              <span v-if="item.status === 0" class="text-red-500">{{ status2Name[item.status] }}</span> <span v-else
                class="text-green-500">Fulfilled</span>
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
                  {{ `${formatDate(item.start_date)}-${formatDate(item.end_date)}` }}
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
                <div class="text-lg">
                  描述
                </div>
                <div>
                  {{ item.describe }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-lg" flex items-center>
                  地理位置
                </div>
                <div class="text-md">
                  {{ item.address }}
                </div>
                <div class="text-coolgray-400">
                  {{ item.fullAddress }}
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- action -->

          <q-card-actions>
            <q-btn flat color="primary" label="Share" />
            <q-btn flat color="secondary" label="Book" />

            <q-space />
          </q-card-actions>

          <!-- bottom -->

          <q-card-section class="flex items-center justify-between">
            <div class="text-gray-500">
              {{ item.tag }}
            </div>
            <q-chip>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
              John
            </q-chip>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
