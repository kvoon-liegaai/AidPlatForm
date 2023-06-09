<script setup lang='ts'>
import { chatSocket } from 'src/service/websocket/chat'
import { notificationSocket } from 'src/service/websocket/notification'
import type { HrApplyModel, MessageModel } from 'src/service/websocket/types'
import { useProfileStore } from 'src/stores/profile.store'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { helpResourceApplyMsgState } from 'src/common/ws'
import type { UserModel } from 'src/service/auth/auth.model'

interface IContact {
  chatId: number // chatId
  targetUser: UserModel
  message: MessageModel
}

interface Notification {
  user: UserModel
  hrApply: HrApplyModel
  hr: HelpResourceModel
}

const router = useRouter()

const notifications = ref<Notification[]>([])

const contacts = ref<IContact[]>()

function onAgree(notification: Notification) {
  console.log('onAgree')
  notificationSocket.emit(
    'handle-apply',
    {
      hrApplyId: notification.hrApply.id,
      helpResourceId: notification.hr.id,
      userId: notification.user.id,
      status: helpResourceApplyMsgState.FULFILLED,
    },
    () => {
      refresh()
    },
  )
}

function onReject(notification: Notification) {
  console.log('onReject')
  notificationSocket.emit(
    'handle-apply',
    {
      hrApplyId: notification.hrApply.id,
      helpResourceId: notification.hr.id,
      userId: notification.user.id,
      status: helpResourceApplyMsgState.REJECTED,
    },
    () => {
      refresh()
    },
  )
}

function chat(contact: IContact) {
  console.log('chat with', contact)
  router.push(`/chat/${contact.targetUser.id}`)
}

function refresh(done?: () => void) {
  chatSocket.emit(
    'fetch-all-chat',
    { userId: useProfileStore().id },
    (newContacts: IContact[]) => {
      contacts.value = newContacts.sort((a, b) => a.message.createTime - b.message.createTime)
      console.log('newContacts', newContacts)
    },
  )
  notificationSocket.emit(
    'fetch-all-hrApply',
    { providerId: useProfileStore().id },
    (notificationList: Notification[]) => {
      console.log('notificationList', notificationList)
      notifications.value = notificationList
        .sort(() => -1)
      if (done)
        done()
    },
  )
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <q-pull-to-refresh color="primary" @refresh="refresh">
    <q-list bordered>
      <q-item-label header>
        通知
      </q-item-label>
      <q-item v-for="notification in notifications" :key="notification.hrApply.id" v-ripple class="q-mb-sm" clickable>
        <q-item-section avatar>
          <q-avatar bg-primary color-white>
            <q-icon name="mark_email_unread" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ notification.user.nickname }}</q-item-label>
          <q-item-label caption lines="1">
            {{ notification.hr.name }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn-group outline>
            <q-btn v-if="notification.hrApply.status === helpResourceApplyMsgState.FULFILLED" label="已同意" color="gray"
              flat dense />
            <q-btn v-if="notification.hrApply.status === helpResourceApplyMsgState.REJECTED" label="已拒绝" color="gray" flat
              dense />
            <div v-if="notification.hrApply.status === helpResourceApplyMsgState.PENDING">
              <q-btn label="拒绝" color="negative" flat dense @click="onReject(notification)" />
              <q-btn label="同意" color="primary" flat dense @click="onAgree(notification)" />
            </div>
            <!-- <q-btn label="查看" color="primary" flat dense /> -->
          </q-btn-group>
        </q-item-section>
      </q-item>

      <q-item v-if="!notifications.length">
        <q-item-section>
          <q-item-label caption>
            暂无
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item-label header>
        私信
      </q-item-label>
      <q-item v-for="contact in contacts" :key="contact.chatId" v-ripple class="q-my-sm" clickable @click="chat(contact)">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <q-icon name="mark_chat_unread" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.targetUser.nickname }}</q-item-label>
          <q-item-label caption lines="1">
            {{ contact.message.content }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color-cool-gray-400 />
        </q-item-section>
      </q-item>
    </q-list>
  </q-pull-to-refresh>
</template>

<style lang='scss' scoped></style>
