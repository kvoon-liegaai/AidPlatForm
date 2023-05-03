<script setup lang='ts'>
import type { UserModel } from 'src/service/auth/auth.model'
import { chatSocket } from 'src/service/websocket/chat'
import type { MessageModel } from 'src/service/websocket/types'
import { useProfileStore } from 'src/stores/profile.store'

interface IContact {
  chatId: number // chatId
  targetUser: UserModel
  message: MessageModel
}

const router = useRouter()

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
  },
)
</script>

<template>
  <div>
    <q-list bordered>
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

      <q-separator />
      <q-item-label header>
        离线
      </q-item-label>

      <q-item v-for="contact in offline" :key="contact.id" v-ripple class="q-mb-sm" clickable>
        <q-item-section avatar>
          <q-avatar>
            <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.name }}</q-item-label>
          <q-item-label caption lines="1">
            {{ contact.email }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="grey" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang='scss' scoped></style>
