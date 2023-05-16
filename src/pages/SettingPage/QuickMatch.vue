<script setup lang='ts'>
import { useLocalStorage } from '@vueuse/core'
import BackBar from 'src/components/BackBar.vue'
import GeoPicker from 'src/components/GeoPicker.vue'
import type { IGeo } from 'src/service/map/map.model'
import { Notify, date } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { useQuickMatchStore } from 'src/stores/quickMatch'
import { subAreasName } from '../HomePage/model'

const router = useRouter()

const showMapPicker = ref(false)

const options = subAreasName

const form = useLocalStorage('quickMatchForm', {
  subArea: '',
  start_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  end_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  ...useDefaultCoords('object'),
  radius: 150,
})

const startDate = ref(form.value.start_date.split(' ')[0])
const startTime = ref(form.value.start_date.split(' ')[1])

const endDate = ref(form.value.end_date.split(' ')[0])
const endTime = ref(form.value.end_date.split(' ')[1])

const addressName = useLocalStorage('quickMatchForm_addressName', '')

watchEffect(() => {
  form.value.start_date = `${startDate.value} ${startTime.value}`
  form.value.end_date = `${endDate.value} ${endTime.value}`
  console.log('form.start_date', form.value.start_date)
  console.log('form.end_date', form.value.end_date)
})

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

function onSubmit() {
  console.log('form.value', form.value)
  useQuickMatchStore().refresh()
    .then(() => {
      router.push('/quick-match-detail')
    })
    .catch((errMsg) => {
      if (typeof errMsg === 'string')
        Notify.create({ message: errMsg })
      console.error(errMsg)
    })
}
</script>

<template>
  <section class="quick-match">
    <q-layout view="lHh lpr lFf" container h-screen>
      <q-header>
        <BackBar title="快速匹配" />
      </q-header>

      <q-page-container>
        <q-page padding>
          <q-form class="q-gutter-md" @submit="onSubmit">
            <q-list padding>
              <q-item-label header>
                设置
              </q-item-label>
              <q-select v-model="form.subArea" standout="bg-primary text-white" :options="options" label="服务分区"
                item-aligned />

              <q-input v-model="form.start_date" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" mask="YYYY-MM-DD">
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
                      <q-time v-model="startTime" mask="HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="form.end_date" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYY-MM-DD">
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
                      <q-time v-model="endTime" mask="HH:mm" format24h>
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
                      <q-toolbar-title>地理位置</q-toolbar-title>
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

              <q-input v-model.number="form.radius" type="number" filled item-aligned label="半径范围(米)" />

              <q-btn label="开始匹配" type="submit" color="primary" w-full />
            </q-list>
          </q-form>
        </q-page>
      </q-page-container>
    </q-layout>
  </section>
</template>

<style lang='scss' scoped></style>
