<script setup lang='ts'>
import BackBar from 'src/components/BackBar.vue'
import GeoPicker from 'src/components/GeoPicker.vue'
import type { IGeo } from 'src/service/map/map.model'
import type { CreateHelpResourceParams } from 'src/service/resource/resource.model'
import { createHelpResource } from 'src/service/resource/resource.api'
import { useSubscription } from '@vueuse/rxjs'
import { Notify, date } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { getTagsBySubAreaName, subAreasName } from '../HomePage/model'

const isSubmitting = ref(false)

const showMapPicker = ref(false)

const options = subAreasName

const form = reactive<CreateHelpResourceParams>({
  name: '',
  describe: '',
  subArea: '',
  tag: '',
  // start_date: '2019-02-22 21:02',
  // end_date: '2019-02-22 21:02',
  start_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  end_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  ...useDefaultCoords('object'),
},
)

const startDate = ref(form.start_date.split(' ')[0])
const startTime = ref(form.start_date.split(' ')[1])

const endDate = ref(form.end_date.split(' ')[0])
const endTime = ref(form.end_date.split(' ')[1])

watchEffect(() => {
  form.start_date = `${startDate.value} ${startTime.value}`
  form.end_date = `${endDate.value} ${endTime.value}`
  console.log('form.start_date', form.start_date)
  console.log('form.end_date', form.end_date)
})

const tagOptions = computed(() => getTagsBySubAreaName(form.subArea)?.map(item => item.tag))

const addressName = ref('')

function provideService() {
  console.log('sq')
  // form.value.geo = JSON.stringify(form.value.geo)
  isSubmitting.value = true
  useSubscription(
    createHelpResource(form)
      .subscribe(() => {
        isSubmitting.value = false
        Notify.create({ position: 'center', message: '创建成功' })
      }),
  )
}

function selectMap() {
  showMapPicker.value = true
}

function onConfirmGeo(geo: IGeo) {
  console.log('geo', geo)
  addressName.value = geo.address
  form.longitude = geo.lnglat.longitude
  form.latitude = geo.lnglat.latitude
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

              <q-select v-model="form.tag" standout="bg-primary text-white" :options="tagOptions" label="服务标签"
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

              <q-input v-model="form.describe" filled item-aligned type="textarea" placeholder="描述信息" />
              <q-btn type="submit" :loading="isSubmitting" class="full-width" filled item-aligned color="primary"
                label="提交">
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
