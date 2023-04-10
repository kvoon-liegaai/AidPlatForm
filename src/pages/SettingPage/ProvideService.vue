<script setup lang='ts'>
import BackBar from 'src/components/BackBar.vue'
import GeoPicker from 'src/components/GeoPicker.vue'
import type { IGeo } from 'src/service/map/map.model'
import type { CreateHelpResourceParams } from 'src/service/resource/resource.model'
import { defaultProvideService } from 'src/types'
import { createHelpResource } from 'src/service/resource/resource.api'
import { useSubscription } from '@vueuse/rxjs'
import { subAreasName } from '../HomePage/model'

const isLoading = ref(false)

const showMapPicker = ref(false)

const options = subAreasName

const form = ref<CreateHelpResourceParams>(defaultProvideService)

const addressName = ref('')

function provideService() {
  console.log('sq')
  // form.value.geo = JSON.stringify(form.value.geo)
  isLoading.value = true
  useSubscription(
    createHelpResource(form.value)
      .subscribe(() => {
        isLoading.value = false
      }),
  )
}

function selectMap() {
  showMapPicker.value = true
}

function onConfirmGeo(geo: IGeo) {
  console.log('geo', geo)
  addressName.value = geo.address
  form.value.longitude = geo.lnglat.longitude
  form.value.latitude = geo.lnglat.latitude
  showMapPicker.value = false
}
</script>

<template>
  <section class="quick-match">
    <q-layout view="lHh lpr lFf" container h-screen>
      <q-header>
        <BackBar title="提供服务" />
      </q-header>

      <q-page-container>
        <q-page padding>
          <q-form class="q-gutter-md" @submit="provideService">
            <q-list padding>
              <q-item-label header>
                设置
              </q-item-label>
              <q-input v-model="form.name" filled item-aligned placeholder="服务名称" />
              <q-select v-model="form.subArea" standout="bg-primary text-white" :options="options" label="服务分区"
                item-aligned />

              <q-input v-model="form.startDate" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.startDate" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template #append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.startDate" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="form.endDate" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.endDate" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template #append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.endDate" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="addressName" filled item-aligned readonly placeholder="设置地理位置" @click="selectMap">
                <template #append>
                  <q-icon name="place" class="cursor-pointer" />
                </template>
              </q-input>

              <q-dialog v-model="showMapPicker">
                <q-layout view="Lhh lpR fff" container class="bg-white">
                  <q-header class="bg-primary">
                    <q-toolbar>
                      <q-toolbar-title>地址选择</q-toolbar-title>
                      <q-btn v-close-popup flat round dense icon="close" />
                    </q-toolbar>
                  </q-header>

                  <q-page-container>
                    <q-page>
                      <GeoPicker :source="{ longitude: form.longitude, latitude: form.latitude }"
                        @confirm="onConfirmGeo" />
                    </q-page>
                  </q-page-container>
                </q-layout>
              </q-dialog>

              <q-input v-model="form.subscribe" filled item-aligned type="textarea" placeholder="描述信息" />
              <q-btn type="submit" :loading="isLoading" class="full-width" filled item-aligned color="primary" label="提交">
                <template #loading>
                  <q-spinner-hourglass class="on-left" />
                  设置中
                </template>
              </q-btn>
            </q-list>
          </q-form>
        </q-page>
      </q-page-container>
    </q-layout>
  </section>
</template>

<style lang='scss' scoped></style>
