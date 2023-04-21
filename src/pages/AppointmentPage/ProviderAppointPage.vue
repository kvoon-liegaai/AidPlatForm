<script setup lang='ts'>
import { getProviderAppointList } from 'src/service/resource/resource.api'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'

const curTab = ref<HelpResourceStatus>(HelpResourceStatus.UNUSED)

const hrList = ref<HelpResourceModel[]>([])

watch(curTab, (tab) => {
  getProviderAppointList(tab)
    .subscribe((list) => {
      return hrList.value = list
    })
})

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
  <!-- <section class="card-list px-4 relative">
                                  <q-card class="my-card" flat bordered>
                                    <q-badge rounded color="green" label="未开始" absolute top-0 right-0 m-2 />
                                    <q-card-section horizontal>
                                      <q-card-section class="q-pt-xs">
                                        <div class="text-overline">
                                                  3 月 12
                                                </div>
                                                <div class="text-h5 q-mt-sm q-mb-xs">
                                                  早上陪跑
                                                </div>
                                                <div class="text-caption text-grey">
                                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                                  dolore magna aliqua.
                                                                            </div>
                                                                                        </q-card-section>

                                                                                        <q-card-section class="col-5 flex flex-center">
                                                                                          <q-img class="rounded-borders" src="https://cdn.quasar.dev/img/parallax2.jpg" />
                                                                                        </q-card-section>
                                                                                      </q-card-section>

                                                                                      <q-separator />

                                                                                              <q-card-actions>
                                                                                                <q-avatar size="30px">
                                                                                                  <img src="https://cdn.quasar.dev/img/avatar.png">
                                                                                                </q-avatar>
                                                                                                <q-btn flat>
                                                                                                  7:30PM
                                                                                                    </q-btn>
                                                                                                    <q-btn flat>
                                                                                                      取消
                                                                                                          </q-btn>
                                                                                                            <q-btn grow-1 color="orange">
                                                                                                              开始
                                                                                                                            </q-btn>
                                                                                                                          </q-card-actions>
                                                                                                                        </q-card>
                                                                                                                      </section> -->
  </div>
</template>

<style lang='scss' scoped></style>
