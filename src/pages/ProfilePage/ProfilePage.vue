<script setup lang='ts'>
import { getProfileById } from 'src/service/user/user.api'
import { DEFAULT_PROFILE } from 'src/service/user/user.model'
import type { ProfileModel } from 'src/service/user/user.model'
import { useProfileStore } from 'src/stores/profile.store'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { useSubscription } from '@vueuse/rxjs'
import { getProvidedResources } from 'src/service/resource/resource.api'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const profileStore = useProfileStore()

const profile = ref<ProfileModel>(DEFAULT_PROFILE)
const helpResources = ref<HelpResourceModel[] | []>([])

const ratingModel = ref(4)
const commentsRecords = ref([
  { id: 0, userId: 0, username: 'peter', date: '2023-12-13', comments: 'asd;lfa;sdfa', rating: 4 },
  { id: 0, userId: 0, username: 'peter', date: '2023-12-13', comments: 'asd;lfa;sdfa', rating: 4 },
  { id: 0, userId: 0, username: 'peter', date: '2023-12-13', comments: 'asd;lfa;sdfa', rating: 4 },
  { id: 0, userId: 0, username: 'peter', date: '2023-12-13', comments: 'asd;lfa;sdfa', rating: 4 },
])

function handleDeleteHR() {
  console.log('handle delete hr')
}

onMounted(() => {
  useSubscription(
    getProfileById(profileStore.id)
      .subscribe(val => profile.value = val),
  )

  useSubscription(
    getProvidedResources(profileStore.id)
      .subscribe(val => helpResources.value = val),
  )
})
</script>

<template>
  <q-bar bg-coolgray-100>
    <div class="col text-center text-weight-bold">
      用户资料
    </div>
  </q-bar>
  <section class="content" py-5>
    <div class="main" flex flex-col>
      <section class="main__top" flex gap-4>
        <q-img src="https://placeimg.com/500/300/nature" spinner-color="white" style="height: 120px; max-width: 100px" />
        <div class="detail" w-full>
          <div class="name" font-medium text-lg flex justify-between mb-4>
            {{ profile.nickname }}
            <q-btn label="编辑" icon="edit" size="sm" rounded outline color="primary" />
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
                评价等级
              </div>
              <div class="card-item__score">
                4.5
              </div>
              <div class="card-item__icon">
                <q-icon class="i-mdi-cellphone-cog" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="main__describe">
        <div class="title">
          个人简介
        </div>
        <p color-bluegray leading-relaxed>
          {{ profile.describe || '这个人很懒什么也没留下' }}
        </p>
      </div>
    </div>

    <div class="comment-record">
      <div class="title">
        评价记录
      </div>
      <q-scroll-area h-42>
        <div class="row no-wrap">
          <div v-for="(comments, key) in commentsRecords" :key="key" class="q-pa-sm">
            <q-card class="my-card bg-[#FAFAFBFF]" w-75 flat>
              <q-card-section>
                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis" flex justify-between>
                    <div>
                      Cafe Basilico
                    </div>
                  </div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="event" />
                    {{ comments.date }}
                  </div>
                </div>

                <q-rating v-model="comments.rating" :max="5" size="20px" />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-caption text-grey" truncate>
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                  Small plates, salads & sandwiches in an intimate setting.
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>

    <div class="provided-service">
      <div class="title">
        我的服务
      </div>
      <div v-if="!helpResources.length" color-bluegray>
        无
      </div>
      <div grid grid-cols-2 gap-5>
        <q-card v-for="hr in helpResources" :key="hr.id" class="my-card">
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom">
              <div class="text-h6" truncate>
                {{ hr.name }}
              </div>
              <div class="text-subtitle2">
                {{ hr.start_date }}
              </div>
            </div>
          </q-img>
          <q-card-actions>
            <q-btn flat>
              编辑
            </q-btn>
            <q-btn flat color="negative" @click="handleDeleteHR">
              删除
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </section>
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
