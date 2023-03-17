<template>
  <section class="quick-match">
    <q-layout view="lHh lpr lFf" container h-screen>
      <q-header>
        <back-bar :title="'快速匹配'"></back-bar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <q-form @submit="setQuickMatch" class="q-gutter-md">
            <q-list padding>
              <q-item-label header>设置</q-item-label>
              <q-select standout="bg-primary text-white" v-model="form.subareaName" :options="options" label="服务分区"
                item-aligned />

              <q-input filled v-model="form.date.from" item-aligned unmasked-value mask="####-##-## ##:##">
                <template v-slot:prepend>
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

                <template v-slot:append>
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

              <q-input filled v-model="form.date.to" item-aligned unmasked-value mask="####-##-## ##:##">
                <template v-slot:prepend>
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

                <template v-slot:append>
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


              <q-input filled v-model="form.geo.address" item-aligned readonly @click="selectMap">
                <template v-slot:append>
                  <q-icon name="place" class="cursor-pointer"></q-icon>
                </template>
              </q-input>


              <!-- <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
            </q-list>
          </q-form>
        </q-page>
      </q-page-container>
    </q-layout>
  </section>
</template>

<script setup lang='ts'>
import BackBar from 'src/components/BackBar.vue';
import { subAreasName } from '../HomePage/model';
const router = useRouter();

const options = subAreasName;

const form = ref({
  subareaName: '',
  date: {
    from: '2019-02-22 21:02',
    to: '2019-02-22 21:02',
  },
  geo: {
    address: '虚拟大学'
  }
})

function setQuickMatch() {
  console.log('sq');
}

function selectMap() {
  router.push('/map/geo-pick');
}
</script>

<style lang='scss' scoped></style>
