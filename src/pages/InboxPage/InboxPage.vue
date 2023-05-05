<script setup lang='ts'>
import { from, map } from 'rxjs'
import type { UserModel } from 'src/service/auth/auth.model'
import { getProfileById } from 'src/service/user/user.api'
import { chatSocket } from 'src/service/websocket/chat'
import { notificationSocket } from 'src/service/websocket/notification'
import type { HrApplyModel, MessageModel } from 'src/service/websocket/types'
import { useProfileStore } from 'src/stores/profile.store'

interface IContact {
  chatId: number // chatId
  targetUser: UserModel
  message: MessageModel
}

interface Notification {
  hrApplyId: number
  user: UserModel
  hrApply: HrApplyModel
}

const router = useRouter()

const notifications = ref<Notification[]>()

const contacts = ref<IContact[]>()

const offline = [{
  id: 5,
  name: 'Brunhilde Panswick',
  email: 'bpanswick4@csmonitor.com',
  avatar: 'avatar2.jpg',
}, {
  id: 6,
  name: 'Winfield Stapforth',
  email: 'wstapforth5@pcworld.com',
  avatar: 'avatar6.jpg',
}]

function chat(contact: IContact) {
  console.log('chat with', contact)
  router.push(`/chat/${contact.targetUser.id}`)
}

chatSocket.emit(
  'fetch-all-chat',
  { userId: useProfileStore().id },
  (newContacts: IContact[]) => {
    contacts.value = newContacts
    console.log('newContacts', newContacts)
  },
)

notificationSocket.emit(
  'fetch-all-hrApply',
  { userId: useProfileStore().id },
  (hrApplyList: HrApplyModel[]) => {
    from(hrApplyList)
      .pipe(
        map((hrApply) => {
          let notification: Notification
          getProfileById(hrApply.userId)
          // TODO: 05.04
          // .subscribe((user: UserModel) => {
          //   notification.user = user
          // })
        }),
      )
    // hrApplyList.map((hrApply: HrApplyModel) => {
    //   getProfileById(hrApply.userId)
    //     .subscribe((user: UserModel) => {

    //     })
    // })
  },
)
</script>

<template>
  <div>
    <q-list bordered>
      <q-item-label header>
        通知
      </q-item-label>
      <q-item v-for="notification in notifications" :key="notification.hrApplyId" v-ripple class="q-mb-sm" clickable>
        <q-item-section avatar>
          <q-avatar>
            <img :src="`https://cdn.quasar.dev/img/${notification.user.avatar}`">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ notification.user.nickname }}</q-item-label>
          <q-item-label caption lines="1">
            {{ notification.hrApply.createAt }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="grey" />
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item-label header>
        私信
      </q-item-label>
      <q-item v-for="contact in contacts" :key="contact.chatId" v-ripple class="q-my-sm" clickable @click="chat(contact)">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            M
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.targetUser.nickname }}</q-item-label>
          <q-item-label caption lines="1">
            {{ contact.message.content }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="green" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang='scss' scoped></style>
