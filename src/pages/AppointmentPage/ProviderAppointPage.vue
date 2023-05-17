<script setup lang='ts'>
import { getProviderAppointList } from 'src/service/resource/resource.api'
import { HelpResourceStatus, status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import PendingCard from './components/PendingCard.vue'
import OngoingCard from './components/OngoingCard.vue'
import FulfillCard from './components/FulfillCard.vue'
import CancelCard from './components/CancelCard.vue'

const curTab = ref<HelpResourceStatus>(HelpResourceStatus.UNUSED)

const hrList = ref<HelpResourceModel[]>([])

// const isLoading = ref(true)

function updateAppointList(tab: HelpResourceStatus, done?: any) {
  getProviderAppointList(tab)
    .subscribe((list) => {
      if (done)
        done()
      return hrList.value = list
    })
}

function refresh(done: any) {
  updateAppointList(curTab.value, done)
}

watch(curTab, (tab) => {
  updateAppointList(tab)
}, {
  immediate: true,
})
</script>

<template>
  <div class="q-gutter-y-md">
    <q-pull-to-refresh @refresh="refresh">
      <q-tabs v-model="curTab" outside-arrows mobile-arrows narrow-indicator dense align="justify"
        class="text-orange bg-coolGray-1 rounded-4">
        <q-tab v-for="(tabName, status) in status2Name" :key="status" :name="Number(status)"
          :label="Number(status) === HelpResourceStatus.UNUSED ? '全部' : tabName" :ripple="false" />
      </q-tabs>
      <JsonViewer :value="hrList" copyable sort theme="light" />
      <section flex flex-col gap-4>
        <div v-for="(hr, key) in hrList" :key="key" class="card-list">
          <PendingCard v-if="hr.status === HelpResourceStatus.PENDING" :hr="hr" :is-provider="true" @refresh="refresh" />
          <OngoingCard v-if="hr.status === HelpResourceStatus.ONGOING" :hr="hr" :is-provider="true" @refresh="refresh" />
          <FulfillCard v-if="hr.status === HelpResourceStatus.FULFILL" :hr="hr" :is-provider="true" @refresh="refresh" />
          <CancelCard v-if="hr.status === HelpResourceStatus.CANCELED" :hr="hr" :is-provider="true" @refresh="refresh" />
          <!-- <PendingCard v-else :hr="hr" /> -->
        </div>
      </section>
    </q-pull-to-refresh>
  </div>
</template>

<style lang='scss' scoped></style>
