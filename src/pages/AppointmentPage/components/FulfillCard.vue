<script setup lang='ts'>
import { useDefaultCoords } from 'src/composition/geo'
import { status2Name } from 'src/service/resource/resource.model'
// import { HelpResourceStatus } from 'src/service/resource/resource.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import GeoNav from 'src/components/GeoNav.vue'
import { Notify, date } from 'quasar'
import { useProfileStore } from 'src/stores/profile.store'
import type { MapNavState } from '../types'
import { setHrStatus, timestamp2MS } from '../utils'
import EvaluateForm from './evaluateForm.vue'

const props = defineProps<{
  hr: HelpResourceModel
  isProvider: boolean
}>()

const selfId = useProfileStore().id

const progress = computed(() => {
  if (!props.hr.record)
    return 0
  console.log('props.hr.record.start_date', typeof props.hr.record.start_date)
  const end_date = Date.parse(date.extractDate(props.hr.end_date, 'YYYY-MM-DD HH:mm').toDateString())
  const start_date = Date.parse(props.hr.record.start_date)
  const record_end_date = Date.parse(props.hr.record.start_date)
  console.log('end_date', end_date)
  console.log('start_date', start_date)
  const res = (record_end_date - start_date) / (end_date - start_date)
  return res < 0 ? 1 : res
})

const progressLabel = computed(() => {
  let timestamp = 0
  if (props.hr.record)
    timestamp = Date.parse(props.hr.record.end_date) - Date.parse(props.hr.record.start_date)

  const { minutes, seconds } = timestamp2MS(timestamp)

  return `共计服务时间${minutes}分钟${seconds}秒`
})

const mapNavState = reactive<MapNavState>({
  isShowMapNav: false,
  source: useDefaultCoords('object'),
})

const evaluateCardState = reactive({
  isShow: false,
  evaluation: computed(() => { // 已存在评论
    console.log('hr.evaluations', props.hr.evaluations)
    return props.hr.evaluations.find(evaluation => evaluation.user.id === selfId)
  }),
  targetUser: computed(() => {
    return props.isProvider ? props.hr.receiver : props.hr.user
  }),
})

function onEvaluate() {
  if (evaluateCardState.evaluation) {
    Notify.create('您已评价')
    return
  }

  console.log('onEvaluate', props.hr)
  evaluateCardState.isShow = true
  // setHrStatus(props.hr, HelpResourceStatus.FULFILL)
}
</script>

<template>
  <q-card class="my-card">
    <q-card-section py-0>
      <div class="time" color-coolGray flex justify-between leading-loose>
        <span>
          <q-icon name="schedule" />
          {{ hr.start_date }}
        </span>
        <span>
          <q-icon name="schedule" />
          {{ hr.end_date }}
        </span>
      </div>
    </q-card-section>

    <q-card-section horizontal>
      <q-card-section>
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" width="80px" height="100%">
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
        </div>
        <div flex justify-between>
          <q-avatar size="30px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <q-btn icon="near_me" btn-gray label="去这里" flat />
          <!-- <q-chip square color="primary" text-color="white" icon="event">
                                                                                                                                                                                                                                                                                                                                                                                    </q-chip> -->
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section>
      <q-linear-progress size="25px" :value="progress" color="accent">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="progressLabel" />
        </div>
      </q-linear-progress>
    </q-card-section>
    <q-expansion-item>
      <template #header>
        <q-item-section avatar>
          <q-avatar src="https://cdn.quasar.dev/img/parallax2.jpg" bg-cool-gray-200 text-color="white" />
        </q-item-section>

        <q-item-section>
          {{ useProfileStore().username }}
        </q-item-section>

        <q-item-section side>
          <div v-if="evaluateCardState.evaluation" flex gap-3>
            <!-- <q-icon :name="ratingScore2Meaning[evaluateCardState.evaluation.ratingScore].emoji" size="30px"
              color-yellow-800 /> -->
            <div flex>
              <q-icon v-for="rating in 5" :key="rating" name="star" size="30px"
                :class="rating <= evaluateCardState.evaluation.ratingScore ? 'color-yellow-400' : 'color-yellow-200'"
                cursor-pointer />
            </div>
          </div>
        </q-item-section>
      </template>

      <q-card>
        <q-card-section leading-loose>
          <div>
            开始时间： {{ date.formatDate(props.hr.record?.start_date, "YYYY年MM月DD日 HH时mm分 ") }}
          </div>
          <div>
            完成时间： {{ date.formatDate(props.hr.record?.end_date, "YYYY年MM月DD日 HH时mm分 ") }}
          </div>
          <div>
            评分:
            <span v-if="props.hr.evaluations.find(item => item.id = useProfileStore().id)?.ratingScore">
              {{ props.hr.evaluations.find(item => item.id = useProfileStore().id)?.ratingScore }} 星
            </span>
            <span v-else>暂无</span>
          </div>
          <span
            v-for="(brief, key) in props.hr.evaluations.find(item => item.id = useProfileStore().id)?.briefs.split(',')"
            :key="key" inline-block bg-orange-100 m-2 px-2 rounded="~ md">
            {{ brief }}
          </span>
          <div>
            <div class="">
              服务评价
            </div>
            <div bg-coolgray-100 p-4 rounded-lg>
              <span v-if="props.hr.evaluations.find(item => item.id = useProfileStore().id)?.description">
                {{ props.hr.evaluations.find(item => item.id = useProfileStore().id)?.description }}
              </span>
              <span v-else>
                暂无
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <hr class="q-separator q-separator--horizontal" aria-orientation="horizontal">
    <q-card-actions>
      <!-- <q-btn grow-1 label="取消" flat btn-gray /> -->
      <q-btn grow-1 :label="evaluateCardState.evaluation ? '已评价' : '评价'" color="primary" text-color="white"
        @click="onEvaluate" />
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
          <GeoNav :state="mapNavState" @set-hr-status="setHrStatus" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog v-model="evaluateCardState.isShow">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title>评价</q-toolbar-title>
          <q-btn v-close-popup flat round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding bg-coolgray-100>
          <EvaluateForm :hr-id="props.hr.id" :user="evaluateCardState.targetUser" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang='scss' scoped></style>
