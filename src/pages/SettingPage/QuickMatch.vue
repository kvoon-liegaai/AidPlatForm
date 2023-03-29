<script setup lang='ts'>
import { useLocalStorage } from '@vueuse/core'
import BackBar from 'src/components/BackBar.vue'
import GeoPicker from 'src/components/GeoPicker.vue'
import type { IGeo, IQuickMatchSheet } from 'src/types'
import { defaultQuickMatchSheet } from 'src/types'
import { subAreasName } from '../HomePage/model'

const showMapPicker = ref(false)

const options = subAreasName

const form = useLocalStorage<IQuickMatchSheet>('quickMatchForm', defaultQuickMatchSheet)

function setQuickMatch() {
  console.log('sq')
}

function selectMap() {
  showMapPicker.value = true
}

function onConfirmGeo(geo: IGeo) {
  console.log('geo', geo)
  form.value.geo = geo
  showMapPicker.value = false
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
          <q-form class="q-gutter-md" @submit="setQuickMatch">
            <q-list padding>
              <q-item-label header>
                设置
              </q-item-label>
              <q-select
                v-model="form.subareaName" standout="bg-primary text-white" :options="options" label="服务分区"
                item-aligned
              />

              <q-input v-model="form.date.from" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date.from" mask="YYYY-MM-DD HH:mm">
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
                      <q-time v-model="form.date.from" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="form.date.to" filled item-aligned unmasked-value mask="####-##-## ##:##">
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.date.to" mask="YYYY-MM-DD HH:mm">
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
                      <q-time v-model="form.date.to" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="form.geo.address" filled item-aligned readonly placeholder="设置地理位置" @click="selectMap">
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
                      <GeoPicker :source="form.geo.lnglat" @confirm="onConfirmGeo" />
                    </q-page>
                  </q-page-container>
                </q-layout>
              </q-dialog>

              <!-- <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
            </q-list>
          </q-form>
        </q-page>
      </q-page-container>
    </q-layout>
  </section>
</template>

<style lang='scss' scoped></style>
