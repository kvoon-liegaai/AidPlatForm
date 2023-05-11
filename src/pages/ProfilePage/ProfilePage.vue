<script setup lang='ts'>
import { getProfileById, updateUserProfile } from 'src/service/user/user.api'
import { DEFAULT_PROFILE } from 'src/service/user/user.model'
import type { ProfileModel } from 'src/service/user/user.model'
import { useProfileStore } from 'src/stores/profile.store'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { useSubscription } from '@vueuse/rxjs'
import { deleteHelpResource, getProvidedResources } from 'src/service/resource/resource.api'
import { Dialog, Notify } from 'quasar'
import { tap } from 'rxjs'
import { getAllEvaluation } from 'src/service/evaluation/evaluation.api'
import type { EvaluationModel } from 'src/service/evaluation/evaluation.model'

const profileStore = useProfileStore()

const profile = ref<ProfileModel>(DEFAULT_PROFILE)
const helpResourceList = ref<HelpResourceModel[]>([])
const evaluationList = ref<EvaluationModel[]>([])

const ratingModel = ref(4)

const editDialogState = reactive({
  visible: false,
  nickname: '',
  email: '',
  describe: '',
})

const checkHrDialogState = reactive({
  visible: false,
  hr: helpResourceList.value[0],
})

watch(() => editDialogState.visible, (v) => {
  if (v) {
    editDialogState.nickname = profile.value.nickname
    editDialogState.email = profile.value.email
    editDialogState.describe = profile.value.describe
  }
})

function onEditProfile() {
  const { nickname, email, describe } = editDialogState
  updateUserProfile({
    nickname,
    email,
    describe,
  })
    .subscribe(() => {
      Notify.create({ message: '修改成功' })
      editDialogState.visible = false
      refresh()
    })
}

function loadProfile() {
  useSubscription(
    getProfileById(profileStore.id)
      .pipe(
        tap((profile) => {
          console.log('profile', profile)
        }),
      )
      .subscribe(val => profile.value = val),
  )
}

function loadHelpResourceList() {
  useSubscription(
    getProvidedResources(profileStore.id)
      .subscribe((hrList) => {
        console.log('hrList', hrList)
        helpResourceList.value = hrList
      }),
  )
}

function loadEvaluationList() {
  getAllEvaluation().subscribe((evaluations) => {
    console.log('evaluations', evaluations)
    evaluationList.value = evaluations
  })
}

function handleDeleteHR(helpResourceId: number) {
  console.log('handle delete hr')
  Dialog.create({
    title: '删除',
    color: 'red',
    message: '确定要删除掉吗?',
    ok: '确定',
    cancel: '取消',
    persistent: true,
  }).onOk(() => {
    useSubscription(
      deleteHelpResource(helpResourceId)
        .subscribe(() => {
          Notify.create({ message: '删除成功' })
          loadHelpResourceList()
        }),
    )
  }).onCancel(() => { /**/ })
}

function refresh(done?: () => void) {
  loadProfile()
  loadHelpResourceList()
  loadEvaluationList()
  if (done)
    done()
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <q-dialog v-model="checkHrDialogState.visible">
    <q-card class="my-card">
      <img src="https://cdn.quasar.dev/img/mountains.jpg">
      <q-card-section>
        <div class="text-h6">
          {{ checkHrDialogState.hr.name }}
        </div>
      </q-card-section>
      <q-card-section>
        <section>
          <span color-primary>
            分区
          </span>
          <span color-coolgray-400>
            {{ checkHrDialogState.hr.subArea }} - {{ checkHrDialogState.hr.tag }}
          </span>
        </section>
        <section>
          <span color-primary>
            描述
          </span>
          <span color-coolgray-400>
            {{ checkHrDialogState.hr.describe }}
          </span>
        </section>
        <section>
          <span color-primary>
            预定时间
          </span>
          <span color-coolgray-400>
            {{ checkHrDialogState.hr.start_date }} - {{ checkHrDialogState.hr.end_date }}
          </span>
        </section>
        <section>
          <span color-primary>
            地理位置
          </span>
          <span color-coolgray-400>
            {{ checkHrDialogState.hr.start_date }} - {{ checkHrDialogState.hr.end_date }}
          </span>
        </section>
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- 资料编辑 dialog -->
  <q-dialog v-model="editDialogState.visible" persistent>
    <q-card w-full>
      <q-toolbar>
        <q-avatar>
          <q-icon name="badge" size="30px" color="primary" />
        </q-avatar>

        <q-toolbar-title><span class="text-weight-bold">编辑</span></q-toolbar-title>

        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <q-input v-model="editDialogState.nickname" type="text" label="昵称" />
        <q-input v-model="editDialogState.email" type="text" label="邮箱" />
        <q-input v-model="editDialogState.describe" type="textarea" label="个人描述" />
      </q-card-section>
      <q-card-actions vertical align="center">
        <q-btn color="primary" w-full label="保存" @click="onEditProfile" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-pull-to-refresh color="primary" @refresh="refresh">
    <q-bar bg-coolgray-100>
      <div class="col text-center text-weight-bold">
        用户资料
      </div>
    </q-bar>
    <section class="content" py-5>
      <div class="main" flex flex-col>
        <section class="main__top" flex gap-4>
          <q-img src="https://placeimg.com/500/300/nature" spinner-color="white"
            style="height: 120px; max-width: 100px" />
          <div class="detail" w-full>
            <div class="name" font-medium text-lg flex justify-between mb-4>
              {{ profile.nickname }}
              <q-btn label="编辑" icon="edit" size="sm" rounded outline color="primary"
                @click="() => editDialogState.visible = true" />
            </div>
            <div class="card-group" flex gap-4>
              <div class="card-item bg-[#EBFDFFFF]">
                <div class="card-item__title">
                  评价等级
                </div>
                <div class="card-item__score">
                  4
                </div>
                <div class="card-item__icon">
                  <q-rating v-model="ratingModel" readonly />
                </div>
              </div>
              <div class="card-item" bg="[#F1F4FDFF]">
                <div class="card-item__title">
                  服务次数
                </div>
                <div class="card-item__score">
                  12
                </div>
                <div class="card-item__icon">
                  <q-icon class="i-mdi-cellphone-cog" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="title">
          邮箱
        </div>
        <p color-bluegray leading-relaxed>
          {{ profile.email }}
        </p>
        <div class="main__describe">
          <div class="title">
            个人描述
          </div>
          <p color-bluegray leading-relaxed>
            {{ profile.describe || '这个人很懒什么也没留下' }}
          </p>
        </div>
      </div>

      <div class="comment-record">
        <div class="title">
          历史评价
        </div>
        <q-scroll-area v-if="evaluationList.length" h-60>
          <div class="row no-wrap">
            <div v-for="(evaluation, key) in evaluationList" :key="key" class="q-pa-sm">
              <q-card class="my-card bg-[#FAFAFBFF]" w-75 flat>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <div class="col text-h6 ellipsis" flex justify-between>
                      <div>
                        {{ evaluation.hr.name }}
                      </div>
                    </div>
                    <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                      <q-icon name="event" />
                      {{ evaluation.id }}
                    </div>
                  </div>
                  <q-rating v-model="evaluation.ratingScore" readonly :max="5" size="20px" />
                </q-card-section>

                <q-card-section>
                  <div flex gap-2>
                    <div v-for="(brief, key) in evaluation.briefs.split(',')" :key="key" bg-orange-100 rounded-2 py-1
                      px-2>
                      {{ brief }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section class=" q-pt-none">
                  <div class="text-caption text-grey" truncate>
                    {{ evaluation.description }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
        <div v-else color-bluegray leading-relaxed>
          暂无历史评价
        </div>
      </div>

      <div class="provided-service">
        <div class="title">
          我的服务
        </div>
        <div v-if="!helpResourceList.length" color-bluegray>
          无
        </div>
        <div grid grid-cols-2 gap-5>
          <q-card v-for="hr in helpResourceList" :key="hr.id" class="my-card">
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
              <div class="absolute-bottom">
                <div class="text-h6" truncate>
                  {{ hr.name }}
                </div>
                <div class="text-subtitle2">
                  {{ hr.tag }}
                </div>
              </div>
            </q-img>
            <q-card-actions>
              <q-btn-group flat>
                <q-btn dense flat>
                  编辑
                </q-btn>
                <q-btn dense flat @click="() => { checkHrDialogState.visible = true; checkHrDialogState.hr = hr }">
                  查看
                </q-btn>
                <q-btn dense flat color="negative" @click="handleDeleteHR(hr.id)">
                  删除
                </q-btn>
              </q-btn-group>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>
  </q-pull-to-refresh>
</template>

<style lang='scss' scoped>
.content>* {
  --at-apply: px-4
}

.title {
  --at-apply: text-h4 font-bold leading-10;
}

.card-item {
  --at-apply: w-27 h-20 flex flex-col items-center justify-evenly flex-1;
  border-radius: 4px;

  .card-item__score {
    --at-apply: font-black
  }
}
</style>
