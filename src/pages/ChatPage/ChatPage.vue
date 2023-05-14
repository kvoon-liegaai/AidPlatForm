<script setup lang='ts'>
import { useSubscription } from '@vueuse/rxjs'
import { date } from 'quasar'
import BackBar from 'src/components/BackBar.vue'
import { getProfileById } from 'src/service/user/user.api'
import type { ProfileModel } from 'src/service/user/user.model'
import { chatSocket } from 'src/service/websocket/chat'
import type { CreateMessageDto, MessageModel } from 'src/service/websocket/types'
import { useProfileStore } from 'src/stores/profile.store'

const route = useRoute()

const scrollAreaRef = ref()

// TODO: 滚动聊天窗口
onMounted(() => {
  console.log('scrollAreaRef.value', scrollAreaRef.value.setScrollPosition)
})

const targetUserId = Number(
  typeof route.params.userId === 'string'
    ? route.params.userId
    : '',
)
const targetUserProfile = ref<ProfileModel>()
const selfProfile = useProfileStore()

const messageList = ref<MessageModel[]>()
const inputMessage = ref('')

console.log('chat userId(target): ', route.params.userId)

useSubscription(
  getProfileById(targetUserId).subscribe((userProfile) => {
    targetUserProfile.value = userProfile
  }),
)

chatSocket.emit('fetch-chat-history', {
  userIdList: [targetUserId, useProfileStore().id],
}, (msgList: MessageModel[]) => {
  messageList.value = msgList
  console.log('msgList', msgList)
})

chatSocket.on('sendMsg', (msg: MessageModel) => {
  messageList.value?.push(msg)
})

function sendMsg() {
  const msgDto: CreateMessageDto = {
    userId: useProfileStore().id,
    targetUserId,
    messageType: 'text',
    content: inputMessage.value,
  }
  chatSocket.emit('sendMsg', msgDto, (res: any) => {
    console.log('res', res)
    if (res)
      messageList.value?.push(res)
  })
}
</script>

<template>
  <section class="chat-page" bg-coolGray-100>
    <q-layout ref="chat" view="hHh lpr fFf">
      <q-header>
        <BackBar :title="targetUserProfile?.nickname || ''" />
      </q-header>

      <q-page-container>
        <section ref="chat" class="chat-view">
          <div ref="scrollAreaRef" q-scroll-area class="q-pa-md row justify-center">
            <div style="width: 100%; max-width: 400px">
              <q-chat-message v-for="(message, key) in messageList" :key="key"
                :name="message.userId === selfProfile.id ? selfProfile.nickname : targetUserProfile?.nickname"
                :avatar="`https://cdn.quasar.dev/img/avatar${message.userId}.jpg`" :text="[message.content]"
                :stamp="date.formatDate(message.createTime, 'MM月DD日 HH时mm分 ')" :sent="message.userId === selfProfile.id"
                :text-color="message.userId === selfProfile.id ? 'white' : 'black'"
                :bg-color="message.userId === selfProfile.id ? 'primary' : 'white'" />
            </div>
          </div>
        </section>
      </q-page-container>

      <q-footer bordered class="bg-grey-8 text-white">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input v-model="inputMessage" rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white"
            placeholder="Type a message" />
          <q-btn round flat icon="send" @click="sendMsg" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </section>
</template>

<style lang='scss' scoped></style>
