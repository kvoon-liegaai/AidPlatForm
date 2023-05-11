<script setup lang='ts'>
import { useSubscription } from '@vueuse/rxjs'
import { createEvaluation } from 'src/service/evaluation/evaluation.api'
import type { ProfileModel } from 'src/service/user/user.model'
import { ratingScore2Meaning } from '../utils'

const props = defineProps<{
  hrId: number
  user: ProfileModel// targetUser
}>()

const ratingScore = ref<keyof typeof ratingScore2Meaning>(5)

const briefs = reactive([
  { value: '有礼貌', checked: false },
  { value: '待人友善、周到', checked: false },
  { value: '真诚', checked: false },
  { value: '脾气较差', checked: false },
  { value: '有经验，效率高', checked: false },
  { value: '细心负责', checked: false },
  { value: '未按照指定时间开展', checked: false },
])

const description = ref('')

const submittable = ref(true)

function checkBrief(targetValue: string) {
  const brief = briefs.find(brief => brief.value === targetValue)
  brief!.checked = !brief!.checked
}

function submit() {
  console.log('submit')
  const checkedBriefValueList: string[] = briefs.filter(brief => brief.checked).map(brief => brief.value)
  useSubscription(
    createEvaluation({
      briefs: checkedBriefValueList,
      description: description.value,
      ratingScore: ratingScore.value,
      hrId: props.hrId,
      targetUserId: props.user.id,
    })
      .subscribe(console.log),
  )
}
</script>

<template>
  <section v-if="props.user" id="driver-rating-view">
    <section id="content-part">
      <div class="rating-card rating-card_expanded">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
        <!-- <van-image class="rating-card__avatar" :width="98" :height="98" round
                                                                                                                                                                                                                                              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" /> -->
        <div class="rating-card__info">
          <div class="rating-card__info__name">
            {{ props.user.nickname }}
          </div>
          <div class="rating-card__info__divider" />
          <div class="rating-card__info__license-number">
            {{ props.user.username }}
          </div>
        </div>
        <div class="rating-card__rating-star">
          <!-- <Icon :icon="ratingScore2Meaning[ratingScore].emoji" class="rating-card__rating-star__emoji" /> -->
          <q-icon :name="ratingScore2Meaning[ratingScore].emoji" size="30px" color-yellow-800 />
          <!-- <van-rate v-model="ratingScore" touchable :size="30" :gutter="6" color="#ffd21e" void-icon="star"
                                                                                                                                                                                                                  void-color="#eee" /> -->
          <!-- <q-rating v-model="ratingScore" size="30px" no-dimming /> -->
          <div flex>
            <q-icon v-for="rating in 5" :key="rating" name="star" size="30px"
              :class="rating <= ratingScore ? 'color-yellow-400' : 'color-yellow-200'" cursor-pointer
              @click="ratingScore = rating as 1 | 2 | 3 | 4 | 5" />
          </div>
        </div>
        <div class="rating-card__rating__meaning">
          {{ ratingScore2Meaning[ratingScore].meaning }}
        </div>
        <section id="bad-review">
          <div class="rating-card__bad-review__brief">
            <button v-for="(brief, key) in briefs" :key="key" cursor-pointer class="rating-card__bad-review__brief__item"
              :class="brief.checked ? 'rating-card__bad-review__brief__item_selected' : ''"
              @click="checkBrief(brief.value)">
              {{ brief.value }}
            </button>
          </div>
          <!-- <van-cell-group class="rating-card__bad-review__description" inset>
                                                                                                                                                                                                                           </van-cell-group> -->
          <q-input v-model="description" filled type="textarea" autogrow />
          <div v-show="!submittable" class="rating-card__bad-review__tip">
            请至少选择一项问题或者描述一下您遇到的问题
          </div>
        </section>
        <q-btn color="primary" icon="check" label="提交" :disable="!submittable" rounded @click="submit" />
      </div>
    </section>
  </section>
  <section v-else>
    未找到该用户
  </section>
</template>

<style lang='scss' scoped>
#bad-review {
  width: var(--rating-card-item-max-width)
}

#driver-rating-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  --rating-card-item-max-width: 258px;
  --rating-card-folded-height: 307px;
  --rating-card-expanded-height: 560px;
}

#top-part {
  height: 50px;
}

#content-part {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  /*align-items: center;*/
}

.rating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  width: 332px;
  height: var(--rating-card-folded-height);

  background-color: #F6F6F6;
  border-radius: 21px;
  transition-property: width;
  transition-duration: 0.5s;
}

.rating-card_expanded {
  height: var(--rating-card-expanded-height);
}

.rating-card_expanded {
  width: 100%;
}

.rating-card>*:not(:first-child) {
  margin-bottom: 15px;
}

.rating-card__avatar {
  width: 98px;
  height: 98px;
  transform: translateY(-25px);
}

.rating-card__info {
  width: 114px;
  height: 52px;
}

.rating-card__info__name {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
}

.rating-card__info__divider {
  height: 0.5px;
  background: #C9C9C9;
}

.rating-card__info__license-number {
  display: inline-block;
  margin-top: 3px;
  padding: 3px;
  background: #3592FF;
  letter-spacing: 2px;
  border-radius: 3px;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 1.2;
  color: #FFFFFF;
}

.rating-card__rating-star {
  height: 56px;
  width: max-content;
  padding: 0 15px;
  background: white;
  border-radius: 28px;
  display: grid;
  grid-row: 1;
  grid-template-columns: 30px 180px;
  column-gap: 10px;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, .3)
}

.rating-card__rating-star__emoji {
  width: 30px;
  height: 30px;
}

.rating-card__bad-review__brief {
  width: var(--rating-card-item-max-width);
}

.rating-card__bad-review__brief__item {
  border: none;
  background: white;
  line-height: 2;
  border-radius: 5px;
  margin: 5px;
}

.rating-card__bad-review__brief__item_selected {
  box-shadow: 0 0 0 2px #FFC403;
}

.rating-card__bad-review__description {
  margin-top: 15px;
  margin-left: 0;
  width: var(--rating-card-item-max-width);
}

.rating-card__bad-review__tip {
  margin-top: 10px;
  color: rgb(249, 111, 111);
}

.rating-card__submit-btn {
  width: var(--rating-card-item-max-width);
  height: 41px;
  border-radius: 5px;
}
</style>
